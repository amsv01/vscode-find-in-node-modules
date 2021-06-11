import * as vscode from 'vscode';

const getWorkspacePath = async () => {
  const workspaces = vscode.workspace.workspaceFolders;

  if (!workspaces) {
    return;
  } else if (workspaces.length > 1) {
    const selectWorkspace = await vscode.window.showQuickPick(
      workspaces.map((workspace) => ({
        label: workspace.name,
        workspace,
      })),
      {
        placeHolder: 'Select a workspace',
      }
    );
    if (!selectWorkspace) {
      return;
    }
    return selectWorkspace.workspace.uri;
  }

  return workspaces[0].uri;
};

export function activate(context: vscode.ExtensionContext) {
  let findInNodeModules = vscode.commands.registerCommand(
    'vscode-find-in-node-modules.find',
    async () => {
      try {
        const workspaceUri = await getWorkspacePath();

        if (!workspaceUri) {
          vscode.window.showErrorMessage('There is no workspace available!');
          return;
        }

        const filename = await vscode.window.showInputBox({
          placeHolder: 'Enter your file or folder name',
        });

        const relativePath = new vscode.RelativePattern(
          workspaceUri,
          `node_modules/**/*{${filename}*,${filename}*/**}`
        );

        const fileList = await vscode.workspace.findFiles(
          relativePath,
          `${workspaceUri.fsPath}/node_modules/**/node_modules/**`
        );

        if (fileList.length === 0) {
          return;
        }

        const selectFile = await vscode.window.showQuickPick(
          fileList.map((file) => ({
            label: file.path.replace(`${workspaceUri.fsPath}/node_modules`, ''),
            file,
          })),
          {
            title: `Result for "${filename}"`,
            placeHolder: 'Filter your result by typing here...',
          }
        );

        if (!selectFile) {
          return;
        }

        const document = await vscode.workspace.openTextDocument(
          selectFile.file
        );
        await vscode.window.showTextDocument(document, 1, false);
      } catch {
        vscode.window.showErrorMessage('Oops, Something went wrong!');
      }
    }
  );

  context.subscriptions.push(findInNodeModules);
}

// this method is called when your extension is deactivated
export function deactivate() {}
