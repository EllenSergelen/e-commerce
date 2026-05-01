import React from 'react';
import ReactMarkdown from 'react-markdown';
import { HiOutlineArrowRight } from 'react-icons/hi';

type Props = {
  results: string | null;
  loading: boolean;
};

const Results: React.FC<Props> = ({ results, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-48 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#4B2E2B]"></div>
        <span className="text-[#4B2E2B] font-medium animate-pulse">Curating your style...</span>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-[#8D7B68] text-center py-10 italic">
        Upload a photo to see the magic happen.
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCFB] rounded-2xl shadow-xl p-8 border border-[#F8E1D9] text-[#4B2E2B] prose prose-stone max-w-none">
      <ReactMarkdown
        components={{
          // Header styling
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-4 text-[#4B2E2B]" {...props} />,
          // This turns [Buy Now](/url) into a real button
          a: ({node, ...props}) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center group bg-[#4B2E2B] text-white px-8 py-3 rounded-full no-underline font-bold transition-all hover:bg-black hover:scale-105 shadow-lg my-4"
            >
              <span>{props.children}</span>
              <HiOutlineArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </a>
          ),
          // List styling
          li: ({node, ...props}) => <li className="mb-2 list-none border-l-2 border-[#F8E1D9] pl-4" {...props} />,
        }}
      >
        {results}
      </ReactMarkdown>
    </div>
  );
};

export default Results;