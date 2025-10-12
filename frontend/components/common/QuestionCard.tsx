// // components/QuestionCard.tsx
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { formatDistanceToNow } from "date-fns";

// export const QuestionCard = ({ question }) => {
//   return (
//     <Card className="bg-white text-black border border-gray-300 shadow-md">
//       <CardHeader>
//         <CardTitle className="text-lg font-semibold">
//           {question.title}
//         </CardTitle>
//         <p className="text-sm text-gray-500">
//           {question.category} - {question.answers.length} answers
//         </p>
//       </CardHeader>
//       <CardContent>
//         <p className="text-gray-700">{question.description}</p>
//       </CardContent>
//       <CardFooter>
//         <Button variant="outline" className="text-green-500 hover:bg-green-100">
//           View Answers
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };
