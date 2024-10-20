import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';

export async function formatFiles(filePaths: string[]): Promise<string> {
    let output = 'Directory Structure:\n\n';

    // Constructing a tree structure
    const tree = constructTree(filePaths);
    output += buildTreeString(tree);

    for (const filePath of filePaths) {
        const content = await fs.readFile(filePath, 'utf-8');
        output += `\n\n---\nFile: ${path.relative(vscode.workspace.rootPath || '', filePath)}\n---\n\n${content}`;
    }

    return output;
}

function constructTree(filePaths: string[]): any {
    const root: any = {};

    for (const filePath of filePaths) {
        const parts = filePath.split(path.sep);
        let currentNode = root;

        for (const part of parts) {
            if (!currentNode[part]) {
                currentNode[part] = {};
            }
            currentNode = currentNode[part];
        }
    }

    return root;
}

function buildTreeString(tree: any, prefix: string = ''): string {
    let result = '';

    const entries = Object.entries(tree);
    for (const [name, subNode] of entries) {
        const isLastItem = entries.indexOf([name, subNode]) === entries.length - 1;
        const linePrefix = isLastItem ? '└── ' : '├── ';
        const childPrefix = isLastItem ? '    ' : '│   ';

        result += `${prefix}${linePrefix}${name}\n`;
        if (Object.keys(subNode as Record<string, any>).length > 0) {
            result += buildTreeString(subNode, prefix + childPrefix);
        }
    }

    return result;
}
