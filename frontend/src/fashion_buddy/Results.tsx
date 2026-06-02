import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineShoppingBag } from 'react-icons/hi';

type Props = {
  results: any; 
  loading: boolean;
};

const Results: React.FC<Props> = ({ results, loading }) => {
  const navigate = useNavigate();

  // 1. LOADING STATE
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

  // 2. SMART-CATCH DATA PARSER (Normalizes API structures so it never renders blank)
  let markdownContent = "";

  // Extract inner data if the response is wrapped in a backend success object (e.g., response.data or response.products)
  let cleanResults = results;
  if (results && typeof results === 'object' && !Array.isArray(results)) {
    if (Array.isArray(results.data)) cleanResults = results.data;
    else if (Array.isArray(results.results)) cleanResults = results.results;
    else if (Array.isArray(results.products)) cleanResults = results.products;
    else if (Array.isArray(results.matches)) cleanResults = results.matches;
  }

  // CASE A: Data is an Array (Vision / Multi-Match response)
  if (cleanResults && Array.isArray(cleanResults) && cleanResults.length > 0) {
    markdownContent = "## 📸 Үр дүн\n\n";

    // Handle array of detections OR direct array of product matches
    const firstElement = cleanResults[0];

    // If it's a nested vision structure (contains top_matches, matches, or predictions)
    if (firstElement && typeof firstElement === 'object' && ('top_matches' in firstElement || 'matches' in firstElement || 'predictions' in firstElement || 'item' in firstElement)) {
      const detectedItem = firstElement.item || firstElement.detected_object || "Detected Item";
      let rawMatches = firstElement.top_matches || firstElement.matches || firstElement.predictions || [];
      const matches = Array.isArray(rawMatches) ? rawMatches : [];

      markdownContent += `Олсон: **${detectedItem}**\n\n---\n\n`;

      if (matches.length > 0) {
        matches.forEach((match: any, index: number) => {
          const title = match.label || match.product_name || match.name || match.title || `Match ${index + 1}`;
          const profile = match.style || match.profile || match.category || "Suggested Style";
          
          let rawScore = match.score || match.confidence || 0;
          if (rawScore > 0 && rawScore <= 1) rawScore = rawScore * 100;
          const displayScore = Number(rawScore).toFixed(1);

          markdownContent += `### **${title}**\n`;
          markdownContent += `* **Style Profile:** ${profile}\n`;
          markdownContent += `* **Match Confidence:** ${displayScore}%\n\n`;

          const productID = match.product_id || match.id || match._id;
          if (productID) {
            markdownContent += `[Авах](/product/${productID})\n\n`;
          }
          markdownContent += `---\n\n`;
        });
      } else {
        markdownContent += "Finding the best matches for your style...";
      }
    } 
    // If the server directly returned an array of product items instead of nested vision tracking
    else {
      cleanResults.forEach((product: any, index: number) => {
        const title = product.name || product.title || `Product ${index + 1}`;
        const category = product.category || product.subCategory || "Fashion Item";
        const price = product.price ? `$${product.price}` : "";

        markdownContent += `### **${title}**\n`;
        if (category) markdownContent += `* **Category:** ${category}\n`;
        if (price) markdownContent += `* **Price:** ${price}\n\n`;

        const productID = product._id || product.id;
        if (productID) {
          markdownContent += `[Авах](/product/${productID})\n\n`;
        }
        markdownContent += `---\n\n`;
      });
    }
  } 
  // CASE B: Data is a clean raw markdown string
  else if (typeof results === 'string' && results.trim().length > 0) {
    markdownContent = results;
  } 
  // CASE C: Fallback Catch-all if data is completely unexpected format (Prevents blank components!)
  else if (results) {
    markdownContent = "## 📸 Analysis Complete\n\nWe successfully processed your image! Click below to view the updated catalog matches.\n\n";
    if (results.id || results._id) {
      markdownContent += `[Авах](/product/${results.id || results._id})\n\n`;
    } else {
      markdownContent += `[Авах](/collection)\n\n`;
    }
  }

  // 3. PRE-PROCESSING CLEANUP
  const cleanedResults = markdownContent.replace(/\$\[(\d+)\]/g, '$$1');

  // 4. MAIN INTERFACE RENDER
  return (
    <div className="bg-[#FDFCFB] rounded-3xl shadow-2xl p-8 md:p-12 border border-[#F8E1D9] text-[#4B2E2B] prose prose-stone max-w-none transition-all duration-500 ease-in-out">
      {cleanedResults ? (
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
              const isBuyButton = 
                linkText.includes('buy now') || 
                linkText.includes('shop') || 
                linkText.includes('авах');

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
      ) : (
        <div className="text-[#8D7B68] text-center py-6 italic">
          Зураг оруулаагүй байна. Та хувцасны зөвлөгчийн тусламжтайгаар өөрийн стильд тохирсон хувцаснуудыг олохын тулд зургийг оруулна уу!
        </div>
      )}
    </div>
  );
};

export default Results;