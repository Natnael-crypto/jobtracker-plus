import { useGetInvoiceClient } from "@/hooks/useInvoice";
import { useGetQuotationClient } from "@/hooks/useQuotations";
import Link from "next/link";

interface Props {
  jobId: string;
  userId: string;
}

export const Invoice: React.FC<Props> = ({ jobId, userId }) => {
  const { data: invoice } = useGetInvoiceClient(jobId, userId);

  return (
    <div>
      {invoice == undefined || invoice.length == 0 ? (
        <p>Contractor have not yet provided a invoice</p>
      ) : null}

      {invoice &&
        invoice != undefined &&
        invoice!.map((q) => (
          <Link
            href={`/client/my-jobs/${jobId}/invoice/${q.id}`}
            key={q.id}
            className="flex items-center space-x-2 mb-2 w-full border justify-between py-4 px-2 rounded-lg border-gray-200"
          >
            <p className="text-gray-600 text-md">Invoice Id: {q.id}</p>
            <p>{q.job_title}</p>
          </Link>
        ))}
    </div>
  );
};
