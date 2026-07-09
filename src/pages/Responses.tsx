import { Link } from "react-router-dom";
import { useGetFormById, useGetFormResponses, useGetForms } from "../api/hooks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ResponsesProps {
  formId?: number;
}

const Responses = ({ formId }: ResponsesProps) => {
  const { data: forms, isLoading: isLoadingForms } = useGetForms();
  const { data: form } = useGetFormById(formId || 0);
  const { data: responses, isLoading, error } = useGetFormResponses(formId);

  if (!formId) {
    if (isLoadingForms) return <div className="p-10 text-gray-500 text-center">Loading forms...</div>;

    return (
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Responses</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-medium text-gray-500 h-12">Form</TableHead>
                <TableHead className="font-medium text-gray-500 h-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms?.length ? forms.map((formItem: any) => (
                <TableRow key={formItem.formid} className="border-b-gray-50 hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900 py-4">{formItem.formtitle}</TableCell>
                  <TableCell className="text-right">
                    <Link className="text-[#5F3EE7] font-medium hover:underline" to={`/forms/${formItem.formid}?tab=Responses`}>
                      View responses
                    </Link>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-10 text-gray-500">No forms found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="p-10 text-gray-500 text-center">Loading responses...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">Failed to load responses.</div>;

  const hasResponses = responses && responses.length > 0;
  const questionLookup = new Map<number, any>();
  const optionLookup = new Map<number, string>();

  form?.pages?.forEach((page: any) => {
    page.sections?.forEach((section: any) => {
      section.questions?.forEach((question: any) => {
        questionLookup.set(question.questionid, question);
        question.options?.forEach((option: any) => {
          optionLookup.set(option.optionid, option.optiontext);
        });
      });
    });
  });

  const formatAnswer = (questionResponse: any) => {
    if (questionResponse.answertext) return questionResponse.answertext;
    if (questionResponse.answernumber !== null && questionResponse.answernumber !== undefined) {
      return String(questionResponse.answernumber);
    }

    const selectedLabels = questionResponse.selected_options
      ?.map((selectedOption: any) => optionLookup.get(selectedOption.optionid) || `Option ${selectedOption.optionid}`)
      .filter(Boolean);

    return selectedLabels?.length ? selectedLabels.join(", ") : "-";
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Submitted Responses ({responses?.length || 0})</h2>
      {!hasResponses ? (
        <div className="bg-white border rounded-xl shadow-sm p-10 text-center">
          <p className="text-gray-500 mb-4">You have not collected any responses yet.</p>
          <p className="text-sm text-gray-400">
            Once users submit your forms, their responses will be tabulated here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-medium text-gray-500 h-12 w-16">No.</TableHead>
                <TableHead className="font-medium text-gray-500 h-12">Submission Date</TableHead>
                <TableHead className="font-medium text-gray-500 h-12">Submitted Answers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((res: any, idx: number) => (
                <TableRow key={res.formresponseid} className="border-b-gray-50 hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900 py-4">{idx + 1}</TableCell>
                  <TableCell>
                    {res.createddate ? new Date(res.createddate).toLocaleString() : "Submitted"}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {res.question_responses?.map((questionResponse: any) => {
                        const question = questionLookup.get(questionResponse.questionid);
                        return (
                          <div key={questionResponse.questionresponseid} className="text-sm">
                            <span className="font-medium text-gray-900">
                              {question?.questiontext || `Question ${questionResponse.questionid}`}:
                            </span>{" "}
                            <span className="text-gray-600">{formatAnswer(questionResponse)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Responses;
