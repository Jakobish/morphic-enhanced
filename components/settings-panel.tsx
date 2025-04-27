'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

// Assume models are loaded from somewhere, for now use a placeholder
// In a real app, you'd load this from lib/config/models.ts or similar
const availableModels = [
  { id: 'model-1', name: 'Model A' },
  { id: 'model-2', name: 'Model B' },
  { id: 'model-3', name: 'Model C' }
]

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [modelOptions, setModelOptions] = useState('') // For model-specific options

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const { selectedModel, apiKey, modelOptions } = JSON.parse(savedSettings);
      setSelectedModel(selectedModel || '');
      setApiKey(apiKey || '');
      setModelOptions(modelOptions || '');
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settingsToSave = {
      selectedModel,
      apiKey,
      modelOptions
    };
    localStorage.setItem('userSettings', JSON.stringify(settingsToSave));
  }, [selectedModel, apiKey, modelOptions]);


  const handleModelChange = (value: string) => {
    setSelectedModel(value)
    // Here you might load default options for the selected model
    setModelOptions('') // Clear options for simplicity for now
  }

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value)
  }

  const handleModelOptionsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setModelOptions(event.target.value);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {/* Replace with your actual button/icon for opening the settings */}
        <Button variant="ghost" size="icon" className="fixed right-4 top-4 z-50">
          ⚙️ {/* Settings Icon */}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Configure your model and API key settings.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              Model
            </Label>
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password" // Use type="password" for API keys
              value={apiKey}
              onChange={handleApiKeyChange}
              className="col-span-3"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelOptions" className="text-right">
              Model Options
            </Label>
            <Textarea
              id="modelOptions"
              value={modelOptions}
              onChange={handleModelOptionsChange}
              className="col-span-3"
              placeholder="Enter model-specific options (e.g., JSON)"
            />
          </div>
        </div>
        {/* You could add a save button here, but auto-saving is handled by useEffect */}
        {/* <SheetFooter>
          <Button type="submit">Save changes</Button>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  )
}
