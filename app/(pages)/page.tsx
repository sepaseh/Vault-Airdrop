"use client";

import { FC, useState } from "react";
import { decodeContainer } from "@/proto/container";
import { decodeVault } from "@/proto/vault";
import { Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import Image from "next/image";

const Component: FC = () => {
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	//const [file] = fileList;

	const parseVault = (base64String: string) => {
		const bytes = Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
		const message = decodeVault(bytes);
		console.table(message);
	};

	const parseContainer = (base64String: string) => {
		const bytes = Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
		const message = decodeContainer(bytes);
		console.table(message);

		if (message.vault) {
			parseVault(message.vault);
		}
	};

	const props: UploadProps = {
		multiple: false,
		showUploadList: false,
		onRemove: () => {
			setFileList([]);
		},
		beforeUpload: (file) => {
			const reader = new FileReader();

			reader.readAsDataURL(file);

			reader.onload = () => {
				message.success(`file "${file.name}" successfully selected.`);

				setFileList([file]);

				if (typeof reader.result === "string" && reader.result.startsWith("data:application/octet-stream;base64,")) {
					const value = reader.result.replace(/^.+?;base64,/, "");

					message.success(`file "${file.name}" successfully decoded.`);

					setFileList([file]);

					parseContainer(atob(value));
				} else {
					message.error(`the selected file is not valid`);

					setFileList([]);
				}
			};

			reader.onerror = (error) => {
				console.log("Error: ", error);

				setFileList([]);
			};

			return false;
		},
		fileList,
	};

	return (
		<div className="home">
			<div className="container mx-auto px-4 flex flex-col justify-center text-center lg:w-[50%] xl:w-[40%] h-[100vh]">
				<div className="flex justify-center mb-12">
					<Image
						src="/images/logo.png"
						alt="logo"
						className="mr-4"
						height={40}
						width={40}
					/>
					<h1 className="leading-10 font-semibold text-[40px]">Vault</h1>
				</div>
				<div className="flex flex-col justify-center items-center rounded-xl mb-8 p-8 bg-[--bw-secondary-color]">
					<h2 className="text-2xl font-bold mb-8">Upload your vault share to start</h2>
					<Upload.Dragger
						{...props}
						className="w-full mb-8"
					>
						<Image
							src="/images/qr-code.png"
							className="mx-auto mb-6"
							width={40}
							height={40}
							alt="qr"
						/>
						<h3 className="text-white text-xl font-semibold mb-2">Upload your QR code here</h3>
						<span className="text-white text-sm">
							Drop your file here or <b className="underline">upload it </b>
						</span>
					</Upload.Dragger>
					<p className="mb-8">If you didn’t save the QR code yet, you can find it in the app in the top right on the main screen</p>
					<span className="w-full rounded-3xl leading-10 bg-[#3a5174]">Start</span>
				</div>
				<p className="mb-8">Don’t have a vault yet? Download Vault now</p>
				<ul className="flex justify-center gap-5">
					<li>
						<Image
							src="/images/apple.png"
							className="mb-4 h-[40px]"
							width={126}
							height={0}
							alt="iPhone"
						/>
						<span>iPhone</span>
					</li>
					<li>
						<Image
							src="/images/google.png"
							className="mb-4 h-[40px]"
							width={126}
							height={0}
							alt="Android"
						/>
						<span>Android</span>
					</li>
					<li>
						<Image
							src="/images/git.png"
							className="mb-4 h-[40px]"
							width={126}
							height={0}
							alt="Mac"
						/>
						<span>Mac</span>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Component;
