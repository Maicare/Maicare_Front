'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, formatDistanceToNow } from 'date-fns';
import { CalendarIcon, Search, Download, Eye, Shield, User, Database, Network, Hash, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { AuditRecord, useAuditLog } from '@/hooks/audit/use-audit-log';
import { useDebounce } from '@/hooks/common/useDebounce';
import { Any } from '@/common/types/types';

export type AuditLogFilter = {
  search: string;
  eventType: string;
  result: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  actorId: string;
  subjectId: string;
};

const eventTypeColors: { [key: string]: string } = {
  user_login: 'bg-blue-100 text-blue-700 border-blue-200',
  user_logout: 'bg-blue-50 text-blue-600 border-blue-150',
  data_access: 'bg-green-100 text-green-700 border-green-200',
  data_export: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  permission_change: 'bg-purple-100 text-purple-700 border-purple-200',
  system_event: 'bg-orange-100 text-orange-700 border-orange-200',
  security_event: 'bg-red-100 text-red-700 border-red-200',
};

const resultColors: { [key: string]: string } = {
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  failure: 'bg-rose-100 text-rose-700 border-rose-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
};

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'user_login':
      return <User className="h-3 w-3" />;
    case 'user_logout':
      return <User className="h-3 w-3" />;
    case 'data_access':
      return <Database className="h-3 w-3" />;
    case 'data_export':
      return <Download className="h-3 w-3" />;
    case 'permission_change':
      return <Shield className="h-3 w-3" />;
    case 'security_event':
      return <Shield className="h-3 w-3" />;
    default:
      return <Eye className="h-3 w-3" />;
  }
};

const getEventTypeDisplay = (eventType: string) => {
  const typeMap: { [key: string]: string } = {
    user_login: 'Login',
    user_logout: 'Logout',
    data_access: 'Data Access',
    data_export: 'Data Export',
    permission_change: 'Permission Change',
    security_event: 'Security Event',
    system_event: 'System Event'
  };
  return typeMap[eventType] || eventType;
};

export default function AuditLogsPage() {
  const [filters, setFilters] = useState<AuditLogFilter>({
    search: '',
    eventType: 'all',
    result: 'all',
    dateRange: {
      from: undefined,
      to: undefined,
    },
    actorId: '',
    subjectId: '',
  });

  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  
  // Debounce filters for API calls
  const debouncedFilters = useDebounce({
    actorId: filters.actorId,
    subjectId: filters.subjectId,
    startTime: filters.dateRange.from?.toISOString(),
    endTime: filters.dateRange.to?.toISOString(),
  }, 500);

  const { logs, error, isLoading, page, setPage } = useAuditLog({ 
    autoFetch: true, 
    ...debouncedFilters 
  });

  const updateFilter = (key: keyof AuditLogFilter, value: Any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateDateRange = (key: 'from' | 'to', value: Date | undefined) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [key]: value
      }
    }));
  };

  const toggleExpand = (eventId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedLogs(newExpanded);
  };

  // Filter logs based on search and other filters
  const filteredData = (logs || []).filter(record => {
    const matchesSearch = 
      filters.search === '' ||
      record.EventType.toLowerCase().includes(filters.search.toLowerCase()) ||
      record.ActorRole.some(role => role.toLowerCase().includes(filters.search.toLowerCase())) ||
      record.Action.toLowerCase().includes(filters.search.toLowerCase()) ||
      record.ActorID.toLowerCase().includes(filters.search.toLowerCase()) ||
      record.SubjectID.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesEventType = filters.eventType === 'all' || record.EventType === filters.eventType;
    const matchesResult = filters.result === 'all' || record.Result === filters.result;
    const matchesActorId = filters.actorId === '' || record.ActorID.toLowerCase().includes(filters.actorId.toLowerCase());
    const matchesSubjectId = filters.subjectId === '' || record.SubjectID.toLowerCase().includes(filters.subjectId.toLowerCase());
    
    // Date range filtering
    let matchesDateRange = true;
    if (filters.dateRange.from) {
      matchesDateRange = matchesDateRange && record.OccuredAt >= filters.dateRange.from;
    }
    if (filters.dateRange.to) {
      // Add one day to include the entire end date
      const endOfDay = new Date(filters.dateRange.to);
      endOfDay.setHours(23, 59, 59, 999);
      matchesDateRange = matchesDateRange && record.OccuredAt <= endOfDay;
    }
    
    return matchesSearch && matchesEventType && matchesResult && matchesActorId && matchesSubjectId && matchesDateRange;
  });

  const clearFilters = () => {
    setFilters({
      search: '',
      eventType: 'all',
      result: 'all',
      dateRange: {
        from: undefined,
        to: undefined,
      },
      actorId: '',
      subjectId: '',
    });
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.eventType !== 'all' ||
    filters.result !== 'all' ||
    filters.dateRange.from !== undefined ||
    filters.dateRange.to !== undefined ||
    filters.actorId !== '' ||
    filters.subjectId !== '';

  // Calculate stats from actual logs
  const totalEvents = logs?.length || 0;
  const successfulEvents = logs?.filter(r => r.Result === 'success').length || 0;
  const failedEvents = logs?.filter(r => r.Result === 'failure').length || 0;
  const uniqueUsers = new Set(logs?.map(r => r.ActorID) || []).size;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Audit Logs
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitor system activities and access patterns
          </p>
        </div>
        <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events, users, IDs..."
                  className="pl-10 h-9 text-sm"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                />
              </div>
            </div>

            {/* Actor ID Filter */}
            <div className="w-full lg:w-[140px]">
              <Input
                placeholder="Actor ID"
                className="h-9 text-sm"
                value={filters.actorId}
                onChange={(e) => updateFilter('actorId', e.target.value)}
              />
            </div>

            {/* Subject ID Filter */}
            <div className="w-full lg:w-[140px]">
              <Input
                placeholder="Subject ID"
                className="h-9 text-sm"
                value={filters.subjectId}
                onChange={(e) => updateFilter('subjectId', e.target.value)}
              />
            </div>

            {/* Event Type Filter */}
            <Select value={filters.eventType} onValueChange={(value) => updateFilter('eventType', value)}>
              <SelectTrigger className="w-full lg:w-[140px] h-9 text-sm">
                <Filter className="h-3 w-3 mr-2" />
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="user_login">Login</SelectItem>
                <SelectItem value="user_logout">Logout</SelectItem>
                <SelectItem value="data_access">Data Access</SelectItem>
                <SelectItem value="data_export">Data Export</SelectItem>
                <SelectItem value="permission_change">Permissions</SelectItem>
              </SelectContent>
            </Select>

            {/* Result Filter */}
            <Select value={filters.result} onValueChange={(value) => updateFilter('result', value)}>
              <SelectTrigger className="w-full lg:w-[120px] h-9 text-sm">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Filter - From */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full lg:w-[140px] h-9 justify-start text-left font-normal text-sm",
                    !filters.dateRange.from && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {filters.dateRange.from ? format(filters.dateRange.from, "MMM d") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.from}
                  onSelect={(date) => updateDateRange('from', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Date Range Filter - To */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full lg:w-[140px] h-9 justify-start text-left font-normal text-sm",
                    !filters.dateRange.to && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {filters.dateRange.to ? format(filters.dateRange.to, "MMM d") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.to}
                  onSelect={(date) => updateDateRange('to', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-sm"
                onClick={clearFilters}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Events</p>
                <p className="text-lg font-semibold text-gray-900">{totalEvents}</p>
              </div>
              <Eye className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Successful</p>
                <p className="text-lg font-semibold text-gray-900">
                  {successfulEvents}
                </p>
              </div>
              <Shield className="h-4 w-4 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Failed</p>
                <p className="text-lg font-semibold text-gray-900">
                  {failedEvents}
                </p>
              </div>
              <Shield className="h-4 w-4 text-rose-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Unique Users</p>
                <p className="text-lg font-semibold text-gray-900">
                  {uniqueUsers}
                </p>
              </div>
              <User className="h-4 w-4 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compact Audit Logs List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Activity Log</CardTitle>
              <CardDescription>
                {isLoading ? (
                  'Loading events...'
                ) : (
                  <>
                    {filteredData.length} of {totalEvents} events
                    {hasActiveFilters && ' (filtered)'}
                  </>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {isLoading ? (
              // Loading state
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <h3 className="text-sm font-semibold text-gray-900">Loading audit logs...</h3>
                <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the data</p>
              </div>
            ) : error ? (
              // Error state
              <div className="p-8 text-center">
                <Shield className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-gray-900">Error loading audit logs</h3>
                <p className="text-sm text-gray-500 mt-1">{error.message || 'Failed to fetch audit data'}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : filteredData.length > 0 ? (
              // Data loaded successfully
              filteredData.map((record) => {
                const isExpanded = expandedLogs.has(record.EventID);
                return (
                  <div
                    key={record.EventID}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-3">
                      {/* Compact View */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Event Icon */}
                          <div className={cn(
                            "p-2 rounded-lg mt-0.5 flex-shrink-0",
                            eventTypeColors[record.EventType]?.replace('border-', 'bg-').split(' ')[0] || 'bg-gray-100'
                          )}>
                            {getEventIcon(record.EventType)}
                          </div>

                          {/* Main Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-medium text-sm text-gray-900">
                                {getEventTypeDisplay(record.EventType)}
                              </span>
                              <Badge 
                                variant="secondary" 
                                className={cn(
                                  "text-xs font-medium",
                                  resultColors[record.Result]
                                )}
                              >
                                {record.Result}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(record.OccuredAt), { addSuffix: true })}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-600 mb-1">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span className="font-mono">{record.ActorID.slice(0, 8)}...</span>
                                <Badge variant="outline" className="text-xs py-0 h-4">
                                  {record.ActorRole[0]}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <Database className="h-3 w-3" />
                                <span>{record.SubjectType}</span>
                                <span className="font-mono">{record.SubjectID.slice(0, 8)}...</span>
                              </div>
                              {record.Ip && (
                                <div className="flex items-center gap-1">
                                  <Network className="h-3 w-3" />
                                  <span>{record.Ip}</span>
                                </div>
                              )}
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="mt-2 space-y-2 text-xs border-t border-gray-100 pt-2">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="font-medium text-gray-500">Action:</span>
                                    <span className="ml-1 capitalize">{record.Action}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-500">Reason:</span>
                                    <span className="ml-1 capitalize">{record.AccessReason.replace('_', ' ')}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <Hash className="h-3 w-3" />
                                    <span className="font-medium text-gray-500">Hash:</span>
                                    <span className="font-mono ml-1">{record.SelfHash.slice(0, 16)}...</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-500">Time:</span>
                                    <span className="ml-1">{format(record.OccuredAt, "PPpp")}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expand Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 flex-shrink-0"
                          onClick={() => toggleExpand(record.EventID)}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // No data state
              <div className="p-8 text-center">
                <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-gray-900">No events found</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {hasActiveFilters ? 'Try adjusting your filters' : 'No audit events available'}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" className="mt-2" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}