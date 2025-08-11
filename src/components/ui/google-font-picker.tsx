"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, ChevronDown, Search, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  GOOGLE_FONTS_CATEGORIES, 
  GOOGLE_FONTS_DATA, 
  getFontsByCategory, 
  searchFonts,
  type GoogleFont 
} from "@/lib/utils/google-fonts-list";
import { loadGoogleFont } from "@/lib/utils/google-fonts";

interface GoogleFontPickerProps {
  value?: string;
  onChange: (fontFamily: string) => void;
  label?: string;
  placeholder?: string;
  showPreview?: boolean;
}

export function GoogleFontPicker({
  value,
  onChange,
  label = "Font Family",
  placeholder = "Select a font...",
  showPreview = true,
}: GoogleFontPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof GOOGLE_FONTS_CATEGORIES | "all">("all");
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  // Filter fonts based on search and category
  const filteredFonts = React.useMemo(() => {
    let fonts = search 
      ? searchFonts(search)
      : selectedCategory === "all" 
        ? GOOGLE_FONTS_DATA
        : getFontsByCategory(selectedCategory);
    
    return fonts.slice(0, 50); // Limit to 50 fonts for performance
  }, [search, selectedCategory]);

  // Load font preview when hovering
  const preloadFont = async (fontFamily: string) => {
    if (!loadedFonts.has(fontFamily)) {
      try {
        await loadGoogleFont(fontFamily);
        setLoadedFonts(prev => new Set([...prev, fontFamily]));
      } catch (error) {
        console.warn("Failed to load font:", fontFamily, error);
      }
    }
  };

  // Load the selected font
  useEffect(() => {
    if (value && !loadedFonts.has(value)) {
      preloadFont(value);
    }
  }, [value, loadedFonts]);

  const selectedFont = GOOGLE_FONTS_DATA.find(font => font.family === value);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" />
              {value ? (
                <div className="flex items-center gap-2">
                  <span 
                    style={{ 
                      fontFamily: loadedFonts.has(value) 
                        ? `"${value}", system-ui, sans-serif` 
                        : undefined 
                    }}
                  >
                    {value}
                  </span>
                  {selectedFont && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedFont.category}
                    </Badge>
                  )}
                </div>
              ) : (
                placeholder
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search fonts..."
                className="flex-1"
                value={search}
                onValueChange={setSearch}
              />
            </div>
            
            {/* Category Filter */}
            <div className="border-b p-2">
              <div className="flex flex-wrap gap-1">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Button>
                {Object.keys(GOOGLE_FONTS_CATEGORIES).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setSelectedCategory(category as keyof typeof GOOGLE_FONTS_CATEGORIES)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            <CommandList>
              <CommandEmpty>No fonts found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[300px]">
                  {filteredFonts.map((font) => (
                    <CommandItem
                      key={font.family}
                      value={font.family}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                      onMouseEnter={() => preloadFont(font.family)}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span 
                            className="font-medium"
                            style={{ 
                              fontFamily: loadedFonts.has(font.family) 
                                ? `"${font.family}", system-ui, sans-serif` 
                                : undefined 
                            }}
                          >
                            {font.family}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {font.category}
                          </Badge>
                        </div>
                        {showPreview && (
                          <p 
                            className="text-sm text-muted-foreground"
                            style={{ 
                              fontFamily: loadedFonts.has(font.family) 
                                ? `"${font.family}", system-ui, sans-serif` 
                                : undefined 
                            }}
                          >
                            The quick brown fox jumps over the lazy dog
                          </p>
                        )}
                      </div>
                      <Check
                        className={cn(
                          "ml-2 h-4 w-4",
                          value === font.family ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
