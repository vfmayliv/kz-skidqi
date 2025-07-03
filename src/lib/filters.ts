
import { supabase } from '@/lib/supabase';
import { DealType, Segment, PropertyType, Filter, FilterOption } from '@/types/filters';

export interface FullFilterConfig {
  id: string;
  name_ru: string;
  name_kz: string;
  type: 'range' | 'select' | 'boolean';
  meta?: any;
  options?: FilterOption[];
}

export interface PropertyTypeWithFilters {
  id: string;
  name_ru: string;
  name_kz: string;
  filters: FullFilterConfig[];
}

export interface SegmentWithPropertyTypes {
  id: string;
  name_ru: string;
  name_kz: string;
  property_types: PropertyTypeWithFilters[];
}

export async function getFiltersForDeal(dealTypeId: string): Promise<SegmentWithPropertyTypes[]> {
  try {
    console.log('Fetching filters for deal type:', dealTypeId);
    
    // 1. Fetch all property types associated with the deal type
    const { data: pt_filters, error: ptError } = await supabase
      .from('property_type_filters')
      .select(`
        property_types!inner(
          id,
          name_ru,
          name_kz,
          segment_id,
          segments!inner(
            id,
            name_ru,
            name_kz
          )
        ),
        filters!inner(
          id,
          name_ru,
          name_kz,
          type,
          meta,
          filter_options(
            id,
            filter_id,
            value,
            name_ru,
            name_kz
          )
        )
      `)
      .eq('deal_type_id', dealTypeId);

    if (ptError) {
      console.error('Error fetching property type filters:', ptError);
      return [];
    }

    if (!pt_filters || !Array.isArray(pt_filters)) {
      console.log('No filters found for deal type:', dealTypeId);
      return [];
    }

    console.log('Found filters:', pt_filters.length);

    // 2. Group by segment and then by property type
    const segmentsMap = new Map<string, SegmentWithPropertyTypes>();

    // Handle the data as it comes from Supabase - each item has property_types and filters as single objects
    for (const item of pt_filters) {
      // Since Supabase returns joined data, we need to handle it correctly
      // Each item has a property_types object and a filters object
      const propertyTypeData = (item as any).property_types;
      const filterData = (item as any).filters;

      if (!propertyTypeData || !filterData) continue;

      // Get segment data from the property type
      const segmentData = propertyTypeData.segments;
      if (!segmentData) continue;

      // Ensure segment exists in map
      if (!segmentsMap.has(segmentData.id)) {
        segmentsMap.set(segmentData.id, {
          id: segmentData.id,
          name_ru: segmentData.name_ru,
          name_kz: segmentData.name_kz,
          property_types: [],
        });
      }

      const currentSegment = segmentsMap.get(segmentData.id)!;

      // Ensure property type exists in segment
      let currentPropertyType = currentSegment.property_types.find(pt => pt.id === propertyTypeData.id);
      if (!currentPropertyType) {
        currentPropertyType = {
          id: propertyTypeData.id,
          name_ru: propertyTypeData.name_ru,
          name_kz: propertyTypeData.name_kz,
          filters: [],
        };
        currentSegment.property_types.push(currentPropertyType);
      }

      // Add filter to property type
      const existingFilter = currentPropertyType.filters.find(f => f.id === filterData.id);
      if (!existingFilter) {
          currentPropertyType.filters.push({
              id: filterData.id,
              name_ru: filterData.name_ru,
              name_kz: filterData.name_kz,
              type: filterData.type as 'range' | 'select' | 'boolean',
              meta: filterData.meta,
              options: filterData.filter_options || [],
          });
      }
    }

    const result = Array.from(segmentsMap.values());
    console.log('Processed segments:', result.length);
    return result;
  } catch (error) {
    console.error('Error in getFiltersForDeal:', error);
    return [];
  }
}
