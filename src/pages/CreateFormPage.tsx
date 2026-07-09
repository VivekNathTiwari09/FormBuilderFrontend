import { useState, useEffect } from 'react';
import { FormBuilder } from '../components/FormBuilder/FormBuilder';
import { FormRenderer } from '../components/FormRenderer/FormRenderer';
import { useNavigate, Link, useParams, useSearchParams } from 'react-router-dom';
import { useCreateForm, useUpdateForm, useGetFormById, useSubmitResponse } from '../api/hooks';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2 } from 'lucide-react';

const CreateFormPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const createFormMutation = useCreateForm();
  const updateFormMutation = useUpdateForm(Number(id));
  const submitResponseMutation = useSubmitResponse();
  
  const { data: form, isLoading } = useGetFormById(Number(id));

  const [activeTab, setActiveTab] = useState('Builder');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleCreateForm = (data: any) => {
    if (id) {
      updateFormMutation.mutate(data, {
        onSuccess: () => {
          alert("Form updated successfully!");
          navigate('/forms');
        },
        onError: (error) => {
          console.error("Failed to update form", error);
          alert("Error updating form");
        }
      });
    } else {
      createFormMutation.mutate(data, {
        onSuccess: () => {
          alert("Form created successfully!");
          navigate('/forms');
        },
        onError: (error) => {
          console.error("Failed to create form", error);
          alert("Error creating form");
        }
      });
    }
  };

  const tabs = ['Summary', 'Builder', 'Preview', 'Responses', 'Settings'];
  const isSaving = createFormMutation.isPending || updateFormMutation.isPending;

  if (id && isLoading) return <div className="p-10 text-gray-500">Loading form...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {isSaving && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-50 flex items-center justify-center">
              <span className="text-xl font-bold text-[#5F3EE7]">Saving...</span>
          </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center space-y-2 slide-in-from-bottom-4 animate-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
            <p className="text-gray-500 text-sm">Response successfully submitted!<br/>(Preview Mode)</p>
            <Button onClick={() => {
              setShowSuccessModal(false);
              setActiveTab('Builder');
            }} className="w-full mt-8 bg-[#5F3EE7] hover:bg-indigo-700 h-11 text-base font-medium rounded-lg">
              Back to Builder
            </Button>
          </div>
        </div>
      )}
      
      {/* Top Header */}
      <div className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-6">
          <Link to="/forms" className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" />
            Back to Forms
          </Link>
          <div className="h-6 w-px bg-gray-200"></div>
          <h1 className="text-xl font-bold text-gray-900">{id ? form?.formtitle || "Edit Survey" : "New Survey"}</h1>
        </div>
        <div>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
            Forms
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-8 border-b border-gray-100 flex items-center justify-between">
        <div className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-[#5F3EE7] text-[#5F3EE7]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <Button className="bg-[#5F3EE7] hover:bg-indigo-700 text-white font-medium rounded-lg h-9 px-4 flex items-center">
          <Edit2 size={16} className="mr-2" />
          Edit Form
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
          <div className={activeTab === 'Builder' ? 'block' : 'hidden'}>
            <FormBuilder onSubmit={handleCreateForm} initialData={form} onPreview={() => setActiveTab('Preview')} />
          </div>
          {activeTab === 'Preview' && (
            form ? (
              <FormRenderer formConfig={form} onSubmit={(data) => {
                submitResponseMutation.mutate(data, {
                  onSuccess: () => setShowSuccessModal(true),
                  onError: (err) => {
                    console.error("Failed to submit response", err);
                    alert("Failed to submit response. Check console for details.");
                  }
                });
              }} />
            ) : (
              <div className="p-8 text-center text-gray-500">Please save the form before previewing.</div>
            )
          )}
          {['Summary', 'Responses', 'Settings'].includes(activeTab) && (
            <div className="p-8 text-center text-gray-500">{activeTab} view coming soon...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateFormPage;
