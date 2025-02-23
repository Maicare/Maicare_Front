import IconButton from "@/components/common/Buttons/IconButton"
import Loader from "@/components/common/loader"
import Panel from "@/components/common/Panel/Panel"
import PencilSquare from "@/components/icons/PencilSquare"
import { useAssessment } from "@/hooks/assessment/use-assessment"
import { AssessmentResponse } from "@/types/assessment.types"
import { LEVEL_OPTIONS } from "@/types/maturity-matrix.types"
import { dateFormat } from "@/utils/timeFormatting"
import { TrashIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"


const AssessmentDetails = ({ assessmentId, clientId }: { assessmentId: string, clientId: string }) => {
    const { readOne } = useAssessment({ autoFetch: false, clientId: parseInt(clientId) });
    const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
    useEffect(() => {
        const fetchClient = async (id: number) => {
            const data = await readOne(id);
            setAssessment(data);
        };
        if (assessmentId) fetchClient(+assessmentId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assessmentId]);
    if (!assessment) return <Loader />;
    return (
        <Panel
            title="Assessment Details"
            containerClassName="px-7 py-4"
            sideActions={
                <div className="flex gap-4">
                    <Link href={`/clients/${clientId}/goals/${assessmentId}/edit`}>
                        <IconButton>
                            <PencilSquare className="w-5 h-5" />
                        </IconButton>
                    </Link>
                    <IconButton
                        buttonType="Danger"
                        onClick={() => { }}
                        disabled={false}
                        isLoading={false}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </IconButton>
                </div>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="w-full">
                    <p className="">Domein</p>
                    <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                        {assessment.topic_name || "Niet Beschikbaar"}
                    </div>
                </div>
                <div className="w-full">
                    <p className="">Initial Level</p>
                    <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                        {LEVEL_OPTIONS.find(it => it.value === assessment.initial_level.toString())?.label || "Niet Beschikbaar"}
                    </div>
                </div>
                <div className="w-full">
                    <p className="">Current Level</p>
                    <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                        {LEVEL_OPTIONS.find(it => it.value === assessment.current_level.toString())?.label || "Niet Beschikbaar"}
                    </div>
                </div>
                <div className="w-full">
                    <p className="">Status</p>
                    <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                        {assessment.is_active ? "Active" : "Inactive"}
                    </div>
                </div>
                <div className="w-full">
                    <p className="">Start Date</p>
                    <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                        {dateFormat(assessment.start_date) || "Niet Beschikbaar"}
                    </div>
                </div>
                <div className="w-full">
                    <p className="">End Date</p>
                    <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                        {dateFormat(assessment.end_date) || "Niet Beschikbaar"}
                    </div>
                </div>
            </div>
        </Panel>
    )
}

export default AssessmentDetails