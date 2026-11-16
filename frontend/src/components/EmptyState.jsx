import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = "No materials found",
  description = "Try adjusting your search keywords, category filters, or explore our requests hub.",
  actionText,
  actionLink,
  icon: Icon = PackageOpen
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center max-w-lg mx-auto my-8 shadow-sm">
      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 mb-6 max-w-sm">{description}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
