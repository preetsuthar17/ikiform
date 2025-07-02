"use client";

import React, { useState } from "react";
import { X, Palette, Bell, User, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTitle } from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AppearanceSettings } from "./appearance-settings";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SettingsSection = "appearance" | "notifications";

const settingsSections = [
  {
    id: "appearance" as const,
    label: "Appearance",
    icon: <Palette className="w-4 h-4" />,
  },
  {
    id: "notifications" as const,
    label: "Notifications",
    icon: <Bell className="w-4 h-4" />,
  },
];

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("appearance");

  const renderSettingsContent = (sectionId: SettingsSection) => {
    switch (sectionId) {
      case "appearance":
        return <AppearanceSettings />;
      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Notifications</h2>
              <p className="text-muted-foreground">
                Manage how you receive notifications from the app.
              </p>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              Notification settings coming soon...
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-6xl h-[85vh] p-0 overflow-hidden">
        <ModalTitle className="sr-only">Settings</ModalTitle>

        {/* Desktop Layout */}
        <div className="hidden md:flex h-full">
          {/* Sidebar */}
          <div className="w-52 0 border-r border-border flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Settings</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 p-4">
              <nav className="space-y-2">
                {settingsSections.map((section) => {
                  const isActive = activeSection === section.id;

                  return (
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      key={section.id}
                      className="w-full text-left items-center justify-start transition-all"
                      onClick={() => setActiveSection(section.id)}
                    >
                      {section.icon}
                      <span className={`font-medium text-sm`}>
                        {section.label}
                      </span>
                    </Button>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-8">{renderSettingsContent(activeSection)}</div>
            </ScrollArea>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col h-full">
          {/* Mobile Header */}
          <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
            <h1 className="text-lg font-semibold">Settings</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Tabs */}
          <div className="px-4 py-2 border-b border-border flex-shrink-0">
            <Tabs
              items={settingsSections}
              value={activeSection}
              onValueChange={(value) =>
                setActiveSection(value as SettingsSection)
              }
              variant="underline"
              size="sm"
            />
          </div>

          {/* Mobile Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                {settingsSections.map((section) => (
                  <TabsContent
                    key={section.id}
                    value={section.id}
                    activeValue={activeSection}
                  >
                    {renderSettingsContent(section.id)}
                  </TabsContent>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
