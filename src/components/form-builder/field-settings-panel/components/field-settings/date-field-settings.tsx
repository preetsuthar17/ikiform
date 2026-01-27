import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { FieldSettingsProps } from "./types";

export function DateFieldSettings({
	field,
	onUpdateSettings,
}: FieldSettingsProps) {
	const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined);

	React.useEffect(() => {
		try {
			const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			setTimeZone(tz);
		} catch {
			setTimeZone(undefined);
		}
	}, []);

	const getDateValue = (timestamp?: number) =>
		timestamp ? new Date(timestamp) : undefined;

	const getFormattedDate = (date: Date) => format(date, "PPP");

	const handleDateSelect = (
		selectedDate: Date | undefined,
		setting: "min" | "max" | "defaultValue"
	) => {
		if (selectedDate) {
			if (setting === "defaultValue") {
				onUpdateSettings({ [setting]: selectedDate.toISOString() });
			} else {
				onUpdateSettings({ [setting]: selectedDate.getTime() });
			}
		} else {
			onUpdateSettings({ [setting]: undefined });
		}
	};

	const minDate = getDateValue(field.settings?.min);
	const maxDate = getDateValue(field.settings?.max);
	const defaultDate = field.settings?.defaultValue
		? new Date(field.settings.defaultValue)
		: undefined;

	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					Date Field Settings
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-4">
					{}
					<div className="flex flex-col gap-2">
						<Label className="text-card-foreground">Minimum Date</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
									data-empty={!minDate}
									variant="outline"
								>
									<CalendarIcon className="h-4 w-4" />
									{minDate ? (
										getFormattedDate(minDate)
									) : (
										<span>Select minimum date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-auto p-0">
								<Calendar
									captionLayout="dropdown"
									mode="single"
									onSelect={(date) => handleDateSelect(date, "min")}
									selected={minDate}
									timeZone={timeZone}
								/>
							</PopoverContent>
						</Popover>
					</div>

					{}
					<div className="flex flex-col gap-2">
						<Label className="text-card-foreground">Maximum Date</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
									data-empty={!maxDate}
									variant="outline"
								>
									<CalendarIcon className="h-4 w-4" />
									{maxDate ? (
										getFormattedDate(maxDate)
									) : (
										<span>Select maximum date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-auto p-0">
								<Calendar
									captionLayout="dropdown"
									mode="single"
									onSelect={(date) => handleDateSelect(date, "max")}
									selected={maxDate}
									timeZone={timeZone}
								/>
							</PopoverContent>
						</Popover>
					</div>

					{}
					<div className="flex flex-col gap-2">
						<Label className="text-card-foreground">Default Date</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
									data-empty={!defaultDate}
									variant="outline"
								>
									<CalendarIcon className="h-4 w-4" />
									{defaultDate ? (
										getFormattedDate(defaultDate)
									) : (
										<span>Select default date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-auto p-0">
								<Calendar
									captionLayout="dropdown"
									mode="single"
									onSelect={(date) => handleDateSelect(date, "defaultValue")}
									selected={defaultDate}
									timeZone={timeZone}
								/>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
