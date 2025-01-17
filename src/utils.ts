import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';

export async function formatFiles(filePaths: string[]): Promise<string> {
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        throw new Error('No workspace folder is open.');
    }

    // Get the root path of the workspace
    const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;

    // Filter out image, binary files, .vscode folder, .mjs files, .map files, and files with 'test' in their name
    const filteredFilePaths = filePaths.map(filePath => path.resolve(filePath)).filter(filePath => {
        if (!filePath) {
            console.error('Encountered undefined filePath during filtering');
            return false;
        }
        return !isIgnoredFile(filePath);
    });

    let output = '';

    // Constructing directory structure header
    output += `# Directory Structure\n\n`;
    const tree = constructTree(filteredFilePaths.map(filePath => path.relative(workspaceRoot, filePath)));
    output += buildTreeString(tree);
    output += `\n===============================================================\n`;

    // Reading each file and formatting the output
    for (const filePath of filteredFilePaths) {
        if (!filePath) {
            console.error('Encountered undefined filePath while reading files');
            continue;
        }
        const relativePath = path.relative(workspaceRoot, filePath);
        let content;
        try {
            content = await fs.readFile(filePath, 'utf-8');
        } catch (error) {
            console.error(`Failed to read file ${filePath}:`, error);
            continue;
        }

        output += `# File: ${relativePath}\n\n`;
        output += `\`\`\`${getFileLanguage(relativePath)}\n`;
        output += `// Content of ${relativePath} starts here\n\n`;
        output += `${content}\n`;
        output += `\n// Content of ${relativePath} ends here\n`;
        output += `\`\`\`\n`;
        output += `===============================================================\n`;
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

/**
 * Gets a suitable language identifier for syntax highlighting in Markdown code blocks.
 * @param filePath The path of the file to determine the language.
 */
function getFileLanguage(filePath: string): string {
    const extension = path.extname(filePath).toLowerCase();
    switch (extension) {
        case '.ts':
            return 'typescript';
        case '.js':
            return 'javascript';
        case '.json':
            return 'json';
        case '.html':
            return 'html';
        case '.css':
            return 'css';
        case '.md':
            return 'markdown';
        case '.py':
            return 'python';
        case '.java':
            return 'java';
        case '.c':
            return 'c';
        case '.cpp':
            return 'cpp';
        case '.cs':
            return 'csharp';
        case '.rb':
            return 'ruby';
        case '.php':
            return 'php';
        case '.go':
            return 'go';
        case '.rs':
            return 'rust';
        case '.swift':
            return 'swift';
        case '.kt':
            return 'kotlin';
        case '.sh':
            return 'bash';
        case '.yaml':
        case '.yml':
            return 'yaml';
        case '.xml':
            return 'xml';
        case '.jsx':
            return 'javascript';
        case '.tsx':
            return 'typescript';
        case '.vue':
            return 'vue';
        case '.scss':
            return 'scss';
        case '.less':
            return 'less';
        case '.lua':
            return 'lua';
        case '.sql':
            return 'sql';
        case '.r':
            return 'r';
        case '.pl':
            return 'perl';
        case '.h':
            return 'cpp';
        case '.dart':
            return 'dart';
        default:
            return ''; // Default to no specific language if not recognized
    }
}

/**
 * Determines if a file is an image, binary, or should be ignored by default.
 * This includes files in the .vscode folder, .mjs files, .map files, and files with 'test' in their name.
 * @param filePath The path of the file to check.
 */
function isIgnoredFile(filePath: string): boolean {
    const extension = path.extname(filePath).toLowerCase();
    const binaryExtensions = [
        '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.ico',
        '.svg', '.webp', '.pdf', '.exe', '.dll', '.bin', '.iso',
        '.zip', '.tar', '.gz', '.rar', '.7z', '.mjs', '.map', '.vsix'
    ];
    const shouldIgnore =
        binaryExtensions.includes(extension) ||
        filePath.includes('.vscode') ||
        false;
    return shouldIgnore;
}

/**
 * Select all files by default, excluding ignored files.
 * @param filePaths List of file paths to filter.
 */
export function selectDefaultFiles(filePaths: string[]): string[] {
    return filePaths.filter(filePath => !isIgnoredFile(filePath));
}