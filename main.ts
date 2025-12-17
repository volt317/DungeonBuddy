//Used for obsidian resources
import { Notice, Plugin, Platform, TFile } from 'obsidian';

//Prime data capture object
export interface Note {
  title: string;
  contentBuffer: string[]; // replace content string
  level: number;
  campaign?: string;
}

// Primitive for type constraints
// Needed to avoid use of any in indeterminite inputs
type FrontMatterPrimitive =
  | string
  | number
  | null
  | string[];

// Type for organizing note meta data
type NoteFrontMatter = {
  series: string;
  header_level: number;
  title: string;
  campaign?: string;
};

//Source types that can be parsed
export type SourceType = "campaign" | "reference" | "homebrew" | "misc";

//Main plugin class
export default class DungeonBuddy extends Plugin {
    currentSourceType: SourceType | null = null;
    onload() {
        const sources: SourceType[] = ["campaign", "reference", "homebrew", "misc"];

        for (const type of sources) {
            this.addCommand({
                id: `import-${type}`,
                name: `Import ${type.charAt(0).toUpperCase() + type.slice(1)} Markdown`,
                callback: () => this.importMarkdown(type)
            });
        }
    }

    //Import markdown function for different source types {campaign | reference | homebrew | misc}
    async importMarkdown(sourceType: SourceType) {
      //Save off the source type
      this.currentSourceType = sourceType;
      
      // 1. Prompt user to pick a markdown file
      const file = await this.openFilePicker();
      if (!file) return

      // 2a. Read the file content
      const filecontent = await this.readFileContent(file);

      // 2b. Normalize if needed
      const markdown = this.normalizeLineEndings(filecontent);

      // 3. Split into notes based on sourceType
      const notes = this.splitMarkdownIntoNotes(markdown);

      // 4. Write notes to vault
      await this.writeNotesToVault(this, notes, (file.name.replace(/\.[^/.]+$/, "")));

      new Notice(`Imported ${notes.length} notes from ${file.name}`);
    }

    // helper to read content
    async readFileContent(file: File): Promise<string> {
        return await file.text();
    }
  
    normalizeLineEndings(md: string): string {
      if (Platform.isWin) {
        // Convert CRLF → LF
        return md.replace(/\r\n/g, "\n");
      }
      // Non-Windows is already LF
      return md;
    }
    
    getFolderPath(sourceName: string): string {
      switch (this.currentSourceType) {
        case "campaign": return `Campaigns/${sourceName}`;
        case "reference": return `Reference/${sourceName}`;
        case "homebrew": return `Homebrew/${sourceName}`;
        default: return `Misc/${sourceName}`;
      }
    }
  
    async openFilePicker(): Promise<File | null> {
      return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".md";
        input.onchange = () => resolve(input.files?.[0] ?? null);
        input.click();
      });
    }
  
  splitMarkdownIntoNotes(markdown: string): Note[] {
    const lines = markdown.split("\n");
    const notes: Note[] = [];

    let currentNote: Note | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
      const headerMatch = line.match(/^(#+)\s+(.*)/);

      if (headerMatch) {
        const level = headerMatch[1].length;
        const title = headerMatch[2].trim();

        if (level === 1) {
          // Save previous note
          if (currentNote) {
            currentNote.contentBuffer = currentContent;
            notes.push(currentNote);
          }

          // Start new note
          currentNote = { title, contentBuffer: [], level };
          currentContent = [];
        }
        else if (currentNote) {
          // Demote subheaders by 1
          const demotedHeader = line.replace(/^(#+)\s+/, (match, hashes) => {
            return "#".repeat(Math.max(0, hashes.length - 1)) + " ";
          });
          currentContent.push(demotedHeader);
        }
      }
      else if (currentNote) {
        currentContent.push(line);
      }
    }

    // Push the last note
    if (currentNote) {
      currentNote.contentBuffer = currentContent;
      notes.push(currentNote);
    }
    return notes;
  }

  async ensureFolderExists(plugin: DungeonBuddy, folderPath: string) {
    const parts = folderPath.split("/"); // Split path into segments
    let currentPath = "";

    for (const part of parts) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const folder = plugin.app.vault.getAbstractFileByPath(currentPath);

        if (!folder) {
            await plugin.app.vault.createFolder(currentPath);
        }
    }
  }
	
  // Helper to create YAML front matter safely
  createFrontMatter(metadata: Record<string, FrontMatterPrimitive>): string {
    const lines = ["---"];
    for (const [key, value] of Object.entries(metadata)) {
      // Quote strings with special characters or spaces
      if (typeof value === "string") {
      	lines.push(`${key}: ${JSON.stringify(value)}`);
      } 
      else {
        lines.push(`${key}: ${value}`);
      }
    }
    lines.push("---");
    return lines.join("\n");
  }

  async writeNotesToVault(plugin: DungeonBuddy, notes: Note[], seriesName: string) {
    const failed: string[] = [];
    const folderPath = plugin.getFolderPath(seriesName);

    // Ensure folder exists
    const folder = plugin.app.vault.getAbstractFileByPath(folderPath);
    if (!folder) {
      await plugin.ensureFolderExists(plugin, folderPath);
    }

    for (const note of notes) {
      const fileNameBase = note.title.replace(/[/\\?%*:|"<>]/g, "_");
      let finalFileName = `${fileNameBase}.md`;
      let counter = 1;

      // Handle duplicates
      while (plugin.app.vault.getAbstractFileByPath(`${folderPath}/${finalFileName}`)) {
        finalFileName = `${fileNameBase}_${counter}.md`;
        counter++;
      }

      const filePath = `${folderPath}/${finalFileName}`;

      try {
      	//Grab the meta info and construct the header block
	const metainfo: NoteFrontMatter = {
  	  series: seriesName,
  	  header_level: note.level,
  	  title: note.title,
  	  ...(note.campaign && { campaign: note.campaign })
        };
        const headerBlock = this.createFrontMatter(metainfo)
      
        // Create file with frontmatter
        await plugin.app.vault.create(filePath, headerBlock);
        // Get file object
        const file = plugin.app.vault.getAbstractFileByPath(filePath);
        if (!file || !(file instanceof TFile)) {
          throw new Error(`Failed to get TFile for path: ${filePath}`);
        }
      
        //Stream buffer for our text
        const encoder = new TextEncoder();
        let buffer: string[] = [];
        let currentBytes = 0;
        const maxBytes = 64000; // safe margin

        for (const line of note.contentBuffer) { // <--- use the array directly
          const lineBytes = encoder.encode(line + "\n").length;

          if (currentBytes + lineBytes > maxBytes) {
            await plugin.app.vault.append(file, buffer.join("\n") + "\n");
            buffer = [];
            currentBytes = 0;
          }

          buffer.push(line);
          currentBytes += lineBytes;
        }
        // Flush remaining lines
        if (buffer.length > 0) {
          await plugin.app.vault.append(file, buffer.join("\n") + "\n");
        }
        await new Promise((res) => setTimeout(res, 20));
      } 
      catch (e) {
        failed.push(note.title);
        console.error("Failed to create note:", note.title, e);
      }
    }
    if (failed.length > 0) {
      new Notice(`Failed to import ${failed.length} notes`);
    }
  }
}
