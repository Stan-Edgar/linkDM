import { useState } from "react";
import axios from "axios";

const DM_TEMPLATE = "Hey [First Name], quick Q. Are you still focused on scaling this year?";

function extractUsername(url) {
  try {
    const clean = url.replace(/\/$/, "");
    const parts = clean.split("/");
    return parts[parts.length - 1].replace("@", "");
  } catch {
    return "";
  }
}

export default function App() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleUrlChange(e) {
    const val = e.target.value;
    setUrl(val);
    const username = extractUsername(val);
    if (username) setName(username);
  }

  async function handleSubmit() {
    if (!url || !name) return;
    setLoading(true);
    setStatus(null);

    try {
      await axios.post("http://localhost:3001/add-lead", {
        name,
        profileLink: url,
      });

      const dm = DM_TEMPLATE.replace("[First Name]", name);
      await navigator.clipboard.writeText(dm);
      setCopied(true);
      setStatus("success");
      setUrl("");
      setName("");
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black tracking-tight">LinkDM</h1>
          <p className="text-gray-400 text-sm mt-1">Paste profile · log to CRM · copy DM</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 space-y-5">

          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Twitter URL</label>
            <input
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://x.com/username"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-300 outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">First Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Edit if needed"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-300 outline-none focus:border-black transition-colors"
            />
          </div>

          {/* DM Preview */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Preview</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Hey <span className="font-semibold text-black">{name || "First Name"}</span>, quick Q. Are you still focused on scaling this year?
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !url || !name}
            className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-100 disabled:text-gray-300 text-white font-semibold rounded-xl py-3 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Logging..." : "Log Lead + Copy DM"}
          </button>

          {/* Status */}
          {status === "success" && (
            <p className="text-center text-sm text-gray-500">
              ✓ Added to CRM {copied && <span className="text-black font-medium">· DM copied</span>}
            </p>
          )}
          {status === "error" && (
            <p className="text-center text-sm text-red-400">Something went wrong. Is the backend running?</p>
          )}
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">LinkDM · Feb 2026</p>
      </div>
    </div>
  );
}