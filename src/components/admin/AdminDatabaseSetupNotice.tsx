type AdminDatabaseSetupNoticeProps = {
  tableName: string;
  migrationFile: string;
};

export function AdminDatabaseSetupNotice({
  tableName,
  migrationFile,
}: AdminDatabaseSetupNoticeProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
      <p className="font-semibold">Database setup required</p>
      <p className="mt-2 leading-6">
        The database is connected, but the{" "}
        <code className="rounded bg-amber-100 px-1">{tableName}</code> table has
        not been created yet.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 leading-6">
        <li>Open your database dashboard → <strong>SQL Editor</strong></li>
        <li>Click <strong>New query</strong></li>
        <li>
          Paste the SQL from{" "}
          <code className="rounded bg-amber-100 px-1">{migrationFile}</code>
        </li>
        <li>Click <strong>Run</strong></li>
        <li>Refresh this page</li>
      </ol>
      <p className="mt-3">
        After that, check <strong>Table Editor → {tableName}</strong> in your
        database dashboard.
      </p>
    </div>
  );
}
