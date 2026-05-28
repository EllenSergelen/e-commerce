import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineShoppingBag } from 'react-icons/hi';

type Props = {
  results: any; // Changed from string | null to any to allow for Array data
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
{/* if (!results) {
    return (
      <div className="text-[#8D7B68] text-center py-12 italic border-2 border-dashed border-[#F8E1D9] rounded-2xl">
        Upload a photo to see your personalized recommendations.
      </div>
    );
  }*/} 

 // 3. POLYMORPHIC HANDLER: Robust Object Mapping
// 3. POLYMORPHIC HANDLER: Mapping Nested Vision Data
  let markdownContent = "";

  if (results && Array.isArray(results) && results.length > 0) {
    markdownContent = "## 📸 Vision Analysis Results\n\n";

    // Grab the first detection (e.g., 'TIE')
    const detection = results[0];
    const detectedItem = detection.item || "Detected Item";
    const matches = Array.isArray(detection.top_matches) ? detection.top_matches : [];

    markdownContent += `Detected: **${detectedItem}**\n\n---\n\n`;

    if (matches.length > 0) {
      matches.forEach((match: any, index: number) => {
        // Digging into the nested 'top_matches' array
        const title = match.label || match.product_name || match.name || `Match ${index + 1}`;
        const profile = match.style || match.profile || "Suggested Style";
        
        // Handle Score
        let rawScore = match.score || match.confidence || 0;
        if (rawScore > 0 && rawScore <= 1) rawScore = rawScore * 100;
        const displayScore = Number(rawScore).toFixed(1);

        markdownContent += `### **${title}**\n`;
        markdownContent += `* **Style Profile:** ${profile}\n`;
        markdownContent += `* **Match Confidence:** ${displayScore}%\n\n`;

        // Link logic for routing
        const productID = match.product_id || match.id || match._id;
        if (productID) {
          markdownContent += `[Авах](/product/${productID})\n\n`;
        }
        markdownContent += `---\n\n`;
      });
    } else {
      markdownContent += "Finding the best matches for your style...";
    }
  } else if (typeof results === 'string') {
    markdownContent = results;
  }
  // 4. Pre-processing Clean up (Safe now because markdownContent is guaranteed to be a string)
  const cleanedResults = markdownContent.replace(/\$\[(\d+)\]/g, '$$1');

  // 5. Main Results Display
  return (
    <div className="bg-[#FDFCFB] rounded-3xl shadow-2xl p-8 md:p-12 border border-[#F8E1D9] text-[#4B2E2B] prose prose-stone max-w-none transition-all duration-500 ease-in-out">
      <ReactMarkdown
        components={{
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-bold mb-6 text-[#4B2E2B] border-b border-[#F8E1D9] pb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-bold mb-2 text-[#5D4037]" {...props} />
          ),
          a: ({ node, href, ...props }) => {
            const linkText = props.children?.toString().toLowerCase() || "";
            const isBuyButton = linkText.includes('buy now') || linkText.includes('shop');

            if (isBuyButton) {
              return (
                <button
                  type="button"
                  onClick={() => href && navigate(href)}
                  className="inline-flex items-center justify-center group bg-[#4B2E2B] text-white px-10 py-4 rounded-2xl font-bold transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-xl my-6 w-full md:w-auto text-left cursor-pointer border-none"
                >
                  <HiOutlineShoppingBag className="mr-3 text-xl group-hover:rotate-12 transition-transform" />
                  <span>{props.children}</span>
                  <HiOutlineArrowRight className="ml-3 transition-transform group-hover:translate-x-2" />
                </button>
              );
            }

            return (
              <a href={href} {...props} className="text-[#8D7B68] underline decoration-[#F8E1D9] hover:text-[#4B2E2B] transition-colors">
                {props.children}
              </a>
            );
          },
          p: ({ node, ...props }) => <p className="text-lg leading-relaxed mb-6 text-[#5D4037]" {...props} />,
          li: ({ node, ...props }) => <li className="mb-3 list-none border-l-4 border-[#F8E1D9] pl-6 italic text-[#8D7B68]" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-extrabold text-[#2D1B19]" {...props} />,
          hr: () => <hr className="border-[#F8E1D9] my-8" />
        }}
      >
        {cleanedResults}
      </ReactMarkdown>
    </div>
  );
};

export default Results;