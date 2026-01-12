import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Download,
  List,
  Grid,
  Clock,
  Users,
  Palmtree,
  Gift,
  Star,
  MoreVertical,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card } from "../../common/Card";
import { Badge, StatusBadge } from "../../common/Badge";
import { Modal } from "../../common/Modal";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { calendarEvents, employees, leaves } from "../../../data";
import { cn } from "../../../utils/cn";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";

type ViewType = "month" | "week" | "day" | "list";
type EventType =
  | "Holiday"
  | "Meeting"
  | "Training"
  | "Birthday"
  | "Anniversary"
  | "Event"
  | "Reminder"
  | "Leave";

const eventTypeColors: Record<
  EventType,
  { bg: string; text: string; border: string }
> = {
  Holiday: {
    bg: "bg-error-50",
    text: "text-error-600",
    border: "border-error-200",
  },
  Meeting: {
    bg: "bg-secondary-50",
    text: "text-secondary-600",
    border: "border-secondary-200",
  },
  Training: {
    bg: "bg-warning-50",
    text: "text-warning-600",
    border: "border-warning-200",
  },
  Birthday: {
    bg: "bg-pink-50",
    text: "text-pink-600",
    border: "border-pink-200",
  },
  Anniversary: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
  },
  Event: {
    bg: "bg-primary-light",
    text: "text-primary",
    border: "border-primary/20",
  },
  Reminder: {
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
  },
  Leave: {
    bg: "bg-success-50",
    text: "text-success-600",
    border: "border-success-200",
  },
};

const eventTypeIcons: Record<EventType, React.ReactNode> = {
  Holiday: <Star className="w-4 h-4" />,
  Meeting: <Users className="w-4 h-4" />,
  Training: <Clock className="w-4 h-4" />,
  Birthday: <Gift className="w-4 h-4" />,
  Anniversary: <Star className="w-4 h-4" />,
  Event: <CalendarIcon className="w-4 h-4" />,
  Reminder: <Clock className="w-4 h-4" />,
  Leave: <Palmtree className="w-4 h-4" />,
};

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([
    "Holiday",
    "Meeting",
    "Training",
    "Birthday",
    "Anniversary",
    "Event",
    "Reminder",
    "Leave",
  ]);

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of month (0 = Sunday)
  const startDay = monthStart.getDay();

  // Combine calendar events with leave events
  const allEvents = [
    ...calendarEvents,
    ...leaves
      .filter((l) => l.status === "Approved")
      .map((leave) => ({
        id: `leave-${leave.id}`,
        title: `${leave.employeeName} - ${leave.type} Leave`,
        type: "Leave" as const,
        startDate: leave.startDate,
        endDate: leave.endDate,
        allDay: true,
        color: "#10B981",
        description: leave.reason,
        createdBy: "system",
      })),
  ].filter((event) => selectedEventTypes.includes(event.type as EventType));

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return allEvents.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const checkDate = new Date(dateStr);
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const toggleEventType = (type: EventType) => {
    setSelectedEventTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // Upcoming events (next 30 days)
  const upcomingEvents = allEvents
    .filter((event) => {
      const eventDate = new Date(event.startDate);
      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
      return eventDate >= today && eventDate <= thirtyDaysLater;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-500 mt-1">
            Manage events, holidays, and schedules
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowEventModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            {Object.keys(eventTypeColors).map((type) => {
              const eventType = type as EventType;
              const isSelected = selectedEventTypes.includes(eventType);
              const colors = eventTypeColors[eventType];
              return (
                <button
                  key={type}
                  onClick={() => toggleEventType(eventType)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all",
                    isSelected
                      ? `${colors.bg} ${colors.text} ${colors.border}`
                      : "bg-gray-50 text-gray-400 border-gray-200",
                  )}
                >
                  {eventTypeIcons[eventType]}
                  {type}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <Button variant="outline" size="sm" onClick={handleToday}>
                  Today
                </Button>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                {(["month", "week", "day", "list"] as ViewType[]).map(
                  (view) => (
                    <button
                      key={view}
                      onClick={() => setViewType(view)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize",
                        viewType === view
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900",
                      )}
                    >
                      {view}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Calendar Grid */}
            {viewType === "month" && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="px-2 py-3 text-center text-sm font-semibold text-gray-600"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: startDay }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="min-h-[120px] bg-gray-50 border-b border-r border-gray-100"
                    />
                  ))}

                  {/* Actual days */}
                  {calendarDays.map((day) => {
                    const dayEvents = getEventsForDay(day);
                    const isCurrentDay = isToday(day);
                    const isSelected =
                      selectedDate && isSameDay(day, selectedDate);

                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "min-h-[120px] p-2 border-b border-r border-gray-100 cursor-pointer transition-colors",
                          isSelected && "bg-primary-light",
                          !isSelected && "hover:bg-gray-50",
                        )}
                      >
                        <div
                          className={cn(
                            "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1",
                            isCurrentDay && "bg-primary text-white",
                            !isCurrentDay && "text-gray-700",
                          )}
                        >
                          {format(day, "d")}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event) => {
                            const colors =
                              eventTypeColors[event.type as EventType] ||
                              eventTypeColors.Event;
                            return (
                              <div
                                key={event.id}
                                className={cn(
                                  "px-2 py-0.5 rounded text-xs font-medium truncate",
                                  colors.bg,
                                  colors.text,
                                )}
                                title={event.title}
                              >
                                {event.title}
                              </div>
                            );
                          })}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500 font-medium">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* List View */}
            {viewType === "list" && (
              <div className="space-y-4">
                {allEvents
                  .sort(
                    (a, b) =>
                      new Date(a.startDate).getTime() -
                      new Date(b.startDate).getTime(),
                  )
                  .map((event) => {
                    const colors =
                      eventTypeColors[event.type as EventType] ||
                      eventTypeColors.Event;
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg border",
                          colors.bg,
                          colors.border,
                        )}
                      >
                        <div className={cn("p-2 rounded-lg", colors.bg)}>
                          {eventTypeIcons[event.type as EventType]}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(event.startDate), "MMM d, yyyy")}
                            {event.startDate !== event.endDate && (
                              <>
                                {" "}
                                -{" "}
                                {format(new Date(event.endDate), "MMM d, yyyy")}
                              </>
                            )}
                          </p>
                        </div>
                        <Badge className={cn(colors.bg, colors.text)}>
                          {event.type}
                        </Badge>
                        <button className="p-2 hover:bg-white/50 rounded-lg">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Quick View</h3>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">
                {format(new Date(), "d")}
              </div>
              <div className="text-lg text-gray-600">
                {format(new Date(), "EEEE")}
              </div>
              <div className="text-sm text-gray-500">
                {format(new Date(), "MMMM yyyy")}
              </div>
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No upcoming events
                </p>
              ) : (
                upcomingEvents.map((event) => {
                  const colors =
                    eventTypeColors[event.type as EventType] ||
                    eventTypeColors.Event;
                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className={cn("p-1.5 rounded-lg", colors.bg)}>
                        {eventTypeIcons[event.type as EventType]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(event.startDate), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Event Legend */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Event Types</h3>
            <div className="space-y-2">
              {Object.entries(eventTypeColors).map(([type, colors]) => (
                <div key={type} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      colors.bg,
                      "border",
                      colors.border,
                    )}
                  />
                  <span className="text-sm text-gray-600">{type}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title="Add New Event"
        size="md"
      >
        <div className="space-y-4">
          <Input label="Event Title" placeholder="Enter event title" />
          <Select
            label="Event Type"
            options={[
              { value: "Holiday", label: "Holiday" },
              { value: "Meeting", label: "Meeting" },
              { value: "Training", label: "Training" },
              { value: "Birthday", label: "Birthday" },
              { value: "Anniversary", label: "Anniversary" },
              { value: "Event", label: "Event" },
              { value: "Reminder", label: "Reminder" },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" />
            <Input label="End Date" type="date" />
          </div>
          <Input
            label="Description"
            placeholder="Enter description (optional)"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowEventModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowEventModal(false)}>Add Event</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarPage;
