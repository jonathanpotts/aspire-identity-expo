import type { LucideIcon } from "lucide-react-native";
import { ChevronRightIcon } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type ListItemProps = {
  label: string;
  icon?: LucideIcon;
  trailing?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  variant?: "default" | "destructive";
  className?: string;
};

type ListSectionProps = {
  title?: string;
  items: ListItemProps[];
};

type ListProps = {
  sections: ListSectionProps[];
};

function ListItem({
  label,
  icon,
  trailing,
  showChevron,
  onPress,
  variant = "default",
  className,
}: ListItemProps) {
  const isDestructive = variant === "destructive";
  const isInteractive = onPress !== undefined;
  const chevronVisible = showChevron ?? isInteractive;

  return (
    <Button
      variant="outline"
      size="lg"
      onPress={onPress}
      disabled={!isInteractive}
      role={!isInteractive ? "none" : undefined}
      style={!isInteractive ? { pointerEvents: "none" } : undefined}
      className={cn("h-auto! py-4", !isInteractive && "opacity-100", className)}
    >
      {icon && (
        <Icon
          as={icon}
          className={cn(
            "size-4 shrink-0",
            isDestructive ? "text-destructive/75" : "text-muted-foreground",
          )}
        />
      )}
      <View className="flex-1 gap-0.5">
        <Text className={cn("text-sm", isDestructive && "text-destructive!")}>
          {label}
        </Text>
      </View>
      {trailing}
      {chevronVisible && (
        <Icon
          as={ChevronRightIcon}
          className={cn(
            "text-muted-foreground size-4 shrink-0",
            isDestructive && "text-destructive/75",
          )}
        />
      )}
    </Button>
  );
}

function ListLabel({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        "text-muted-foreground px-1 text-xs font-medium tracking-widest uppercase",
        className,
      )}
      {...props}
    />
  );
}

function ListSection({ title, items }: ListSectionProps) {
  return (
    <View className="gap-2">
      {title && <ListLabel>{title}</ListLabel>}
      <View>
        {items.map((item, index) => (
          <ListItem
            key={item.label}
            {...item}
            className={cn(item.className, {
              "rounded-t-none border-t-0": index !== 0,
              "rounded-b-none": index !== items.length - 1,
              "rounded-t-lg!": index === 0,
              "rounded-b-lg!": index === items.length - 1,
            })}
          />
        ))}
      </View>
    </View>
  );
}

function List({ sections }: ListProps) {
  return (
    <View className="gap-4">
      {sections.map((section, index) => (
        <ListSection key={section.title ?? index} {...section} />
      ))}
    </View>
  );
}

export { List, ListSection };
