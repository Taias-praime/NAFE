import { Paperclip, Trash2 } from 'lucide-react';

export const FilesList = ({ files, onClick, showDelete }: any) => {
	return (
		<ul className="flex flex-col gap-4">
			{files.map((f: any) => (
				<FileItem onClick={onClick} showDelete={showDelete} file={f} />
			))}
		</ul>
	);
};

export const FileItem = ({ file, onClick, showDelete }: any) => {
	return (
		<a href={file} target="_blank">
			<div className="py-3 px-5 bg-muted flex justify-between items-center gap-3 rounded-lg overflow-hidden min-h-16">
				<div className="text-center">
					<Paperclip className="text-foreground" size={25} />
				</div>
				<p className="line-clamp-2 text-ellipsis">{file}</p>
				{
					showDelete && (
						<button onClick={onClick}>
							<Trash2 className="text-red-600" />
						</button>
					)
				}
			</div>
		</a>
	);
};
