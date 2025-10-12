"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import TopNav from "@/components/langing/top";
import Footer from "@/components/langing/Footer";

import { Question as QuestionType } from "@/types/qa";
import { useQuestions } from "@/hooks/qa";
import CreateQuestionForm from "@/components/common/CreateQuetion";
import { formatDateToReadable } from "@/lib/date_converter";
import { useUser } from "@/hooks/useLogin";
import { AllServices } from "@/data/services";

// 1. Ask a Trade Banner
const AskATrade: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card className="relative overflow-hidden border-0 shadow-none rounded-sm bg-white mb-8 p-0">
      <div className="flex flex-col sm:flex-row items-center sm:items-start relative z-10 ">
        <div className="flex-1 flex flex-col max-w-lg md:p-8 pr-4 items-center sm:items-start justify-center sm:justify-start mx-auto text-center sm:text-left">
          <CardTitle className="text-4xl text-gray-600 mb-2">
            Ask a Trade
          </CardTitle>
          <CardDescription className="text-gray-600 mb-6 text-lg">
            Got a question that only a tradesperson can answer? Thousands of
            trades are ready to help.
          </CardDescription>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-4 px-6 rounded-sm  shadow-sm hover:shadow-lg focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Ask your question
          </Button>
        </div>
        <div className="sm:w-2/3 mt-6 sm:mt-0 flex justify-center sm:justify-end">
          <img src="/man-trade.svg" alt="" />
        </div>
      </div>
      <div>{isOpen && <CreateQuestionForm />}</div>
    </Card>
  );
};

// 2. Search Questions Component
const SearchQuestions: React.FC<{
  query: string;
  setQuery: (value: string) => void;
}> = ({ query, setQuery }) => (
  <Card className="mb-8 bg-white border border-gray-200 shadow-none rounded-sm border-0">
    <CardTitle className="text-2xl font-semibold text-gray-600 mb-2">
      Search our questions
    </CardTitle>
    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-1/2 justify-center sm:justify-start">
      <Input
        placeholder="Enter your question"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow text-black placeholder-gray-500 h-12"
      />
      <Button className="bg-green-500 hover:bg-green-600 text-white font-medium py-6 px-8 rounded-sm shadow-sm hover:shadow-lg focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
        Search
      </Button>
    </div>
  </Card>
);

// 3. Question Card Component
const QuestionCard: React.FC<{ question: QuestionType }> = ({ question }) => (
  <Card className="bg-white border border-gray-200 shadow-none rounded-sm p-6 md:p-8 mb-6">
    <CardTitle
      onClick={() => (window.location.href = `/questions/${question.id}`)}
      className="text-xl text-black cursor-pointer hover:underline"
    >
      {question.title}
    </CardTitle>
    <div className="text-gray-600 mb-2">
      <span className="text-gray-500 font-medium px-4 py-1 rounded-full border border-gray-200 mr-2">
        {question.category}
      </span>
      <span className="text-green-500 font-medium">
        {question.answer_count} answers
      </span>
    </div>
    <p className="text-gray-700 mb-2">{question.content}</p>
    <div className="flex justify-between items-end border-t border-gray-200 pt-4">
      <p className="text-sm text-gray-500">
        Asked by{" "}
        <span className="font-medium text-black">{question.first_name}</span> on{" "}
        <span className="font-medium text-black">
          {formatDateToReadable(question.created_at)}
        </span>
      </p>
      <Button
        onClick={() => (window.location.href = `/questions/${question.id}`)}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-sm"
      >
        View answers
      </Button>
    </div>
  </Card>
);

// 4. Question List Component
const QuestionList: React.FC<{
  query: string;
  filter: string;
  sort: string;
  my?: boolean;
}> = ({ query, filter, sort, my }) => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);

  const { data, isLoading, isError } = useQuestions(
    page,
    limit,
    query,
    filter,
    sort,
    my
  );

  if (isLoading) return <p>Loading questions...</p>;
  if (isError) return <p>Error loading questions.</p>;

  if (!data || data.data.length === 0) return <p>No questions found.</p>;

  return (
    <div>
      {data.data.map((q) => (
        <QuestionCard key={q.id} question={q} />
      ))}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded"
        >
          Prev
        </Button>
        <span className="text-gray-600">
          Page {page} of {data!.pagination.total_pages}
        </span>
        <Button
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded"
          onClick={() => setPage((p) => p + 1)}
          disabled={page === Math.ceil(data.pagination.total / limit)}
        >
          Next
        </Button>
      </div>
      <br />
    </div>
  );
};

// 5. Main Questions Page
const Questions: React.FC = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("All");
  const [my, setMy] = useState(false);
  const { data: user } = useUser();

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <TopNav />
      <div className="max-w-5xl mx-auto space-y-8 mt-12">
        <AskATrade />

        <SearchQuestions query={query} setQuery={setQuery} />

        <div className="flex justify-between items-center mb-6">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[220px] bg-white border-gray-300 focus:ring-green-600 focus:ring-2">
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent className="max-h-[250px] overflow-y-auto">
              <SelectItem value="All">All</SelectItem>
              {AllServices.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-4">
            {user != undefined ? (
              <Button
                className="bg-gray-200 hover:bg-gray-300 text-black rounded mr-2"
                onClick={() => setMy(true)}
              >
                Only Main
              </Button>
            ) : (
              <></>
            )}
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Answered">Most Answered</SelectItem>
                <SelectItem value="Newest">Newest</SelectItem>
                <SelectItem value="Oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <QuestionList query={query} filter={filter} sort={sort} my={my} />
      </div>
      <Footer />
    </div>
  );
};

export default Questions;
