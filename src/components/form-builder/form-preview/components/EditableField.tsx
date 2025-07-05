// External libraries
import React from "react";
import { Edit3 } from "lucide-react";

// UI components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Hooks
import { useEditableField } from "../hooks/useEditableField";

// Types
interface EditableFieldProps {
  value: string;
  placeholder?: string;
  onSave: (value: string) => void;
  className?: string;
  inputClassName?: string;
  component?: "input" | "textarea";
  rows?: number;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function EditableField({
  value,
  placeholder,
  onSave,
  className = "",
  inputClassName = "",
  component = "input",
  rows = 1,
  disabled = false,
  children,
}: EditableFieldProps) {
  const {
    isEditing,
    tempValue,
    inputRef,
    textareaRef,
    setIsEditing,
    setTempValue,
    handleSave,
    handleKeyDown,
  } = useEditableField(value, onSave);

  if (disabled) {
    return (
      <div className={className}>
        {children || (
          <div className="text-muted-foreground">{value || placeholder}</div>
        )}
      </div>
    );
  }

  return (
    <div className={`group relative flex flex-col gap-2 ${className}`}>
      {isEditing ? (
        component === "textarea" ? (
          <Textarea
            ref={textareaRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => handleKeyDown(e, true)}
            placeholder={placeholder}
            className={inputClassName}
            rows={rows}
          />
        ) : (
          <Input
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => handleKeyDown(e, false)}
            placeholder={placeholder}
            className={inputClassName}
          />
        )
      ) : (
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-accent/10 rounded-ele p-2 transition-colors w-full"
          onClick={() => setIsEditing(true)}
        >
          {children || (
            <div className="text-foreground">
              {value || (
                <span className="text-muted-foreground italic">
                  {placeholder}
                </span>
              )}
            </div>
          )}
          <Edit3 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
      )}
    </div>
  );
}
