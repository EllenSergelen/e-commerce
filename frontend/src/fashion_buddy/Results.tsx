import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom'; // Added for single page navigation
import { HiOutlineArrowRight, HiOutlineShoppingBag } from 'react-icons/hi';

type Props = {
  results: string | null;
  loading: boolean;
};

const Results: React.FC<Props> = ({ results, loading }) => {
  const navigate = useNavigate();

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4B2E2B]"></div>
        <span className="text-[#4B2E2B] font-medium animate-pulse text-lg">
          Analyzing your style...
        </span>
      </div>
    );
  }

  // 2. Empty State
  if (!results) {
    return (
      <div className="text-[#8D7B68] text-center py-12 italic border-2 border-dashed border-[#F8E1D9] rounded-2xl">
        Upload a photo to see your personalized recommendations.
      </div>
    );
  }

  // 3. Pre-processing Clean up: Strip formatting quirks like $[100] down to $100
  const cleanedResults = results.replace(/\$\[(\d+)\]/g, '$$1');

  // 4. Main Results Display
  return (
    <div className="bg-[#FDFCFB] rounded-3xl shadow-2xl p-8 md:p-12 border border-[#F8E1D9] text-[#4B2E2B] prose prose-stone max-w-none transition-all duration-500 ease-in-out">
      <ReactMarkdown
        components={{
          // Headers
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-bold mb-6 text-[#4B2E2B] border-b border-[#F8E1D9] pb-2" {...props} />
          ),
          
          // The "Buy Now" Button Logic
          a: ({ node, href, ...props }) => {
            // Check if the link text contains "Buy Now" or "Shop"
            const linkText = props.children?.toString().toLowerCase() || "";
            const isBuyButton = linkText.includes('buy now') || linkText.includes('shop');

            if (isBuyButton) {
              return (
                <button
                  type="button"
                  onClick={() => {
                    if (href) {
                      // Routes internally to /product/:id without triggering a page refresh
                      navigate(href);
                    }
                  }}
                  className="inline-flex items-center justify-center group bg-[#4B2E2B] text-white px-10 py-4 rounded-2xl font-bold transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-xl my-6 w-full md:w-auto text-left cursor-pointer border-none"
                >
                  <HiOutlineShoppingBag className="mr-3 text-xl group-hover:rotate-12 transition-transform" />
                  <span>{props.children}</span>
                  <HiOutlineArrowRight className="ml-3 transition-transform group-hover:translate-x-2" />
                </button>
              );
            }

            // Normal links (Privacy, Info, etc.) stay as standard layout elements
            return (
              <a 
                href={href}
                {...props} 
                className="text-[#8D7B68] underline decoration-[#F8E1D9] hover:text-[#4B2E2B] transition-colors"
              >
                {props.children}
              </a>
            );
          },

          // Stylist Notes / Paragraphs
          p: ({ node, ...props }) => (
            <p className="text-lg leading-relaxed mb-6 text-[#5D4037]" {...props} />
          ),

          // Lists
          li: ({ node, ...props }) => (
            <li className="mb-3 list-none border-l-4 border-[#F8E1D9] pl-6 italic text-[#8D7B68]" {...props} />
          ),
          
          // Bold text emphasis
          strong: ({ node, ...props }) => (
            <strong className="font-extrabold text-[#2D1B19]" {...props} />
          ),
        }}
      >
        {cleanedResults}
      </ReactMarkdown>
    </div>
  );
};

export default Results;