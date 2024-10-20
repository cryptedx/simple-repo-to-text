import * as path from 'path'; // Ensure path is imported
import * as vscode from 'vscode';
import { formatFiles, selectDefaultFiles } from './utils';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('simpleRepoToText.convertWorkspace', async () => {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) {
            vscode.window.showErrorMessage('No workspace folder is open.');
            return;
        }

        // Get all files in the workspace folder
        const files = await vscode.workspace.findFiles('**/*', '**/node_modules/**');
        
        // Select default files, excluding binary and image files
        const defaultFiles = selectDefaultFiles(files.map(file => file.fsPath));
        
        if (files.length === 0) {
            vscode.window.showErrorMessage('No suitable files found in the workspace.');
            return;
        }

        // Add all files to quick pick items
        const quickPickItems = files.map(fileUri => {
            const filePath = fileUri.fsPath;
            const isDefaultSelected = defaultFiles.includes(filePath);
            return {
                label: path.basename(filePath),
                description: filePath,
                picked: isDefaultSelected // Only non-binary files are pre-selected
            };
        });

        const selectedItems = await vscode.window.showQuickPick(
            quickPickItems,
            {
                canPickMany: true,
                placeHolder: 'Select files to include in the text output',
            }
        );

        if (!selectedItems || selectedItems.length === 0) {
            vscode.window.showInformationMessage('No files selected.');
            return;
        }

        // Map back the selected items to their file paths
        const selectedFiles = selectedItems.map(item => item.description);

        try {
            const formattedContent = await formatFiles(selectedFiles);
            const document = await vscode.workspace.openTextDocument({
                content: formattedContent,
                language: 'plaintext'
            });
            await vscode.window.showTextDocument(document);
        } catch (error) {
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
