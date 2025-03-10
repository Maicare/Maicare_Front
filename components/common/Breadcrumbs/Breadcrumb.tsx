import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  path?: {
    pageName: string;
    href: string;
  }[];
}
const Breadcrumb = ({ pageName, path }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-slate-800  dark:text-white">{pageName}</h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          {
            (path ?? []).map((item, index) => (
              <li key={index}>
                <Link className="font-medium" href={item.href}>
                  {item.pageName} /
                </Link>
              </li>
            ))
          }
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
