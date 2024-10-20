import * as vscode from 'vscode';
import { formatFiles } from './utils';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('simpleRepoToText.convertWorkspace', async () => {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) {
            vscode.window.showErrorMessage('No workspace folder is open.');
            return;
        }

        const folderUri = folders[0].uri;

        // Get all files in the workspace folder
        const files = await vscode.workspace.findFiles('**/*', '**/node_modules/**');
        
        if (files.length === 0) {
            vscode.window.showErrorMessage('No files found in the workspace.');
            return;
        }

        const selectedFiles = await vscode.window.showQuickPick(
            files.map(file => file.fsPath),
            {
                canPickMany: true,
                placeHolder: 'Select files to include in the text output'
            }
        );

        if (!selectedFiles || selectedFiles.length === 0) {
            vscode.window.showInformationMessage('No files selected.');
            return;
        }

        try {
            const formattedContent = await formatFiles(selectedFiles);
            const document = await vscode.workspace.openTextDocument({
                content: formattedContent,
                language: 'plaintext'
            });
            await vscode.window.showTextDocument(document);
        } catch (error) {
            // Correcting error handling here by casting to 'Error'
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error formatting files: ${error.message}`);
            } else {
                vscode.window.showErrorMessage('An unknown error occurred while formatting files.');
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
