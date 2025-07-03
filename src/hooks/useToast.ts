
import { toast as sonnerToast } from "sonner";
import * as React from "react";
import { useAppStore } from "@/stores/useAppStore";

// Define proper type for toast input
type ToastProps = 
  | string 
  | React.ReactNode 
  | {
      title?: string | React.ReactNode;
      description?: string | React.ReactNode;
      action?: React.ReactNode;
      variant?: "default" | "destructive";
      [key: string]: any;
    };

interface UseToastReturn {
  toast: (props: ToastProps) => void;
}

const useToast = (): UseToastReturn => {
  const { language } = useAppStore();
  
  return {
    toast: (props: ToastProps) => {
      // Handle string or ReactElement directly
      if (typeof props === 'string' || React.isValidElement(props)) {
        sonnerToast(props);
      } 
      // Handle object props
      else if (props && typeof props === 'object') {
        const safeProps = { ...props } as Record<string, any>;
        
        // Extract title and ensure it's a string or ReactNode
        let title: string | React.ReactNode = '';
        if ('title' in safeProps && safeProps.title !== undefined) {
          if (typeof safeProps.title === 'string' || React.isValidElement(safeProps.title)) {
            title = safeProps.title;
          } else {
            title = String(safeProps.title);
          }
        }
        
        // Extract description and ensure it's a string or ReactNode
        let description: string | React.ReactNode | undefined = undefined;
        if ('description' in safeProps && safeProps.description !== undefined) {
          if (typeof safeProps.description === 'string' || React.isValidElement(safeProps.description)) {
            description = safeProps.description;
          } else {
            description = String(safeProps.description);
          }
        }
        
        // Extract action
        const action = 'action' in safeProps ? safeProps.action as React.ReactNode : undefined;
        
        // Extract variant
        const variant = 'variant' in safeProps ? safeProps.variant as string : undefined;
        
        // Prepare toast options
        const toastOptions: Record<string, any> = {};
        
        if (description !== undefined) {
          toastOptions.description = description;
        }
        
        if (action !== undefined) {
          toastOptions.action = action;
        }
        
        // Only include variant if it exists
        if (variant !== undefined) {
          toastOptions.variant = variant;
        }
        
        // Add any other properties from safeProps, excluding those we've already processed
        Object.keys(safeProps).forEach(key => {
          if (!['title', 'description', 'action', 'variant'].includes(key)) {
            toastOptions[key] = safeProps[key];
          }
        });
        
        // Call sonner toast with proper parameters
        sonnerToast(title, toastOptions);
      } else {
        // Fallback for any other types
        sonnerToast(String(props));
      }
    },
  };
};

export { useToast, sonnerToast as toast };
