import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const GEMINI_API_KEY = "GEMINI_API_KEY"; // Store in .env for security

function App() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    // Function to fetch AI-generated content with structured HTML
    const generateBlogContent = async () => {
        if (!title) {
            alert("Please enter a title before generating content.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Write a well-formatted blog post in HTML format about: ${title}. 
                Ensure the response includes headings (<h2>), paragraphs (<p>), and bullet points (<ul><li>).</ul>`,
                                },
                            ],
                        },
                    ],
                }
            );

            // Extract AI-generated content
            const aiText =
                response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "<p>Failed to generate content.</p>";

            setContent(aiText); // Update the editor with HTML content
        } catch (error) {
            console.error("Error fetching AI content:", error);
            alert("Error generating content. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='container py-5'>
                <div className='mb-3'>
                    <label htmlFor='title'>Title</label>
                    <input
                        id='title'
                        type='text'
                        className='form-control'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className='mb-3'>
                    <label htmlFor='content'>Content</label>
                    <ReactQuill
                        theme='snow'
                        value={content}
                        onChange={setContent}
                    />
                </div>

                <button
                    className='btn btn-primary mt-3'
                    onClick={generateBlogContent}
                    disabled={loading}>
                    {loading ? "Generating..." : "Generate Blog Content"}
                </button>
            </div>
        </>
    );
}

export default App;