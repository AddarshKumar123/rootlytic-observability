import React, { useState } from "react";
import { calculateTimeRange } from "./CalculateTimeRange";
import { Portal, Select, createListCollection } from "@chakra-ui/react"

const TimeRangePicker = ({ onChange }) => {
  const presets = [
    { label: "Last 15 min", value: "15m" },
    { label: "Last 30 min", value: "30m" },
    { label: "Last 1 hour", value: "1h" },
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
  ];

  const collection = createListCollection({
    items: presets,
  });

  return (
    <div>
      <Select.Root 
      collection={collection}
      size="sm" 
      width=""
      onValueChange={(e) => {
        const selected = e.value[0];        
        onChange(calculateTimeRange(selected));
      }}
      >
      <Select.HiddenSelect />
      <Select.Label>Select Time Range</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select Time Range" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
    </div>
  );
};

export default TimeRangePicker;