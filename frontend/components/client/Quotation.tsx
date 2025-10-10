import { useGetQuotationClient } from "@/hooks/useQuotations";
import Link from "next/link";

interface Props {
  jobId: string;
  userId: string;
}

export const Quotation: React.FC<Props> = ({ jobId, userId }) => {
  const { data: quotation } = useGetQuotationClient(jobId, userId);

  return (
    <div>
      {quotation == undefined || quotation.length == 0 ? (
        <p>Contractor have not yet provided a quotation</p>
      ) : null}

      {quotation &&
        quotation != undefined &&
        quotation!.map((q) => (
          <Link
            href={`/client/my-jobs/${jobId}/quote/${q.quotation.id}`}
            key={q.quotation.id}
            className="flex items-center space-x-2 mb-2 w-full border justify-between py-4 px-2 rounded-lg border-gray-200"
          >
            <p className="text-gray-600 text-md">Quote Id: {q.quotation.id}</p>
            <p>{q.quotation.job_title}</p>
          </Link>
        ))}
    </div>
  );
};
