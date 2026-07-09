import { useState, useMemo } from 'react';
import { useGetForms, usePublishForm } from '../api/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, MoreVertical, Edit2, Eye, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StatusBadge = ({ formstatusid }: { formstatusid: number }) => {
  if (formstatusid === 2) {
    return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">Published</span>;
  }
  return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">Draft</span>;
};

const FormsList = () => {
  const { data: forms, isLoading, error } = useGetForms();
  const publishFormMutation = usePublishForm();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const handlePublish = (formId: number) => {
    publishFormMutation.mutate(formId, {
      onSuccess: () => {
        alert("Form published successfully!");
      },
      onError: () => {
        alert("Error publishing form.");
      }
    });
  };

  const filteredForms = useMemo(() => {
    if (!forms) return [];
    return forms.filter((form: any) => {
      const matchesSearch = form.formtitle.toLowerCase().includes(searchQuery.toLowerCase());
      const isPublished = form.formstatusid === 2;
      const matchesStatus = statusFilter === 'All' 
        ? true 
        : statusFilter === 'Published' ? isPublished : !isPublished;
      return matchesSearch && matchesStatus;
    });
  }, [forms, searchQuery, statusFilter]);

  if (isLoading) return <div className="p-10 text-gray-500">Loading forms...</div>;
  if (error) return <div className="p-10 text-red-500">Error loading forms</div>;

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Forms</h2>
          <p className="text-gray-500">Create, manage and organize your forms.</p>
        </div>
        <Link to="/forms/create">
          <Button className="bg-[#5F3EE7] hover:bg-indigo-700 text-white font-medium rounded-lg px-6 h-11">+ Create New Form</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search forms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-gray-200 bg-gray-50 focus-visible:ring-indigo-500" 
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
            <select className="h-10 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Recently Updated</option>
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b-gray-100">
              <TableHead className="font-medium text-gray-500 h-12">Form Title</TableHead>
              <TableHead className="font-medium text-gray-500 h-12">Status</TableHead>
              <TableHead className="font-medium text-gray-500 h-12 text-center">Responses</TableHead>
              <TableHead className="font-medium text-gray-500 h-12 text-center">Version</TableHead>
              <TableHead className="font-medium text-gray-500 h-12 text-center w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredForms?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  No forms found.
                </TableCell>
              </TableRow>
            )}
            {filteredForms?.map((form: any) => (
              <TableRow key={form.formid} className="border-b-gray-50 hover:bg-gray-50/50">
                <TableCell className="font-medium text-gray-900 py-4">{form.formtitle}</TableCell>
                <TableCell>
                  <StatusBadge formstatusid={form.formstatusid} />
                </TableCell>
                <TableCell className="text-center text-gray-600">0</TableCell>
                <TableCell className="text-center text-gray-600">{form.versionnumber}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    {/* @ts-ignore */}
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border border-gray-100 z-[100]">
                      <DropdownMenuItem onClick={() => navigate(`/forms/${form.formid}`)} className="cursor-pointer hover:bg-gray-50">
                        <Edit2 className="mr-2 h-4 w-4" />
                        <span>Edit Form</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/forms/${form.formid}?tab=Preview`)} className="cursor-pointer hover:bg-gray-50">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Preview</span>
                      </DropdownMenuItem>
                      {form.formstatusid !== 2 && (
                        <DropdownMenuItem onClick={() => handlePublish(form.formid)} className="cursor-pointer hover:bg-gray-50 text-emerald-600 focus:text-emerald-700">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Publish</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FormsList;
