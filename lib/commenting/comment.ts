/**
 * Commenting System for Journey Elements
 * 
 * Why: Users need to leave feedback on nodes/connections for refinement
 *       AI can understand and respond to feedback
 *       Team collaboration on journeys
 * 
 * What: Comment on nodes, connections, or entire journey
 *       Thread replies to comments
 *       AI analyzes and suggests improvements
 * 
 * How: Store comments with target reference (nodeId, connectionId, or "journey")
 *      Link to user who created it
 *      Optional AI response/interpretation
 */

export interface Comment {
  id: string;
  userId: string;
  journeyId: string;
  
  // What is being commented on
  targetType: "NODE" | "CONNECTION" | "JOURNEY" | "PATH";
  targetId: string; // nodeId, connectionId, or "journey"
  
  // Comment content
  content: string;
  resolved: boolean;
  
  // AI response
  aiResponse?: string;
  aiSuggestions?: Array<{
    type: "improvement" | "question" | "alternative";
    content: string;
  }>;
  
  // Threading
  parentId?: string;
  replies?: Comment[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  userEmail?: string;
  userName?: string;
}

export interface CommentInput {
  journeyId: string;
  targetType: "NODE" | "CONNECTION" | "JOURNEY" | "PATH";
  targetId: string;
  content: string;
  parentId?: string;
}

/**
 * Extract suggestions from comment text
 * Look for keywords that suggest improvements
 */
export function extractSuggestionTypes(content: string): Array<"improvement" | "question" | "alternative"> {
  const types: Array<"improvement" | "question" | "alternative"> = [];
  
  const improvementKeywords = ["should", "could be", "better if", "improve", "enhance"];
  const questionKeywords = ["why", "what if", "how about", "consider", "?"];
  const alternativeKeywords = ["instead", "alternatively", "or maybe", "what about"];
  
  const lowerContent = content.toLowerCase();
  
  if (improvementKeywords.some(k => lowerContent.includes(k))) {
    types.push("improvement");
  }
  if (questionKeywords.some(k => lowerContent.includes(k))) {
    types.push("question");
  }
  if (alternativeKeywords.some(k => lowerContent.includes(k))) {
    types.push("alternative");
  }
  
  return types.length > 0 ? types : ["question"];
}

/**
 * Prepare comment for AI analysis
 * Include context: node/edge details, position in journey
 */
export function prepareCommentContext(
  comment: Comment,
  targetData?: {
    label?: string;
    description?: string;
    type?: string;
  }
): string {
  let context = `User comment on ${comment.targetType.toLowerCase()}: "${comment.content}"`;
  
  if (targetData) {
    context += `\n\nTarget details:\n`;
    if (targetData.label) context += `- Label: ${targetData.label}\n`;
    if (targetData.type) context += `- Type: ${targetData.type}\n`;
    if (targetData.description) context += `- Description: ${targetData.description}\n`;
  }
  
  return context;
}

/**
 * Sample AI prompt for analyzing comment
 */
export function buildCommentAnalysisPrompt(
  comment: Comment,
  targetData?: any,
  journeyContext?: string
): string {
  const context = prepareCommentContext(comment, targetData);
  
  return `You are helping analyze user feedback on a user journey map.

User's comment: "${comment.content}"

${context}

${journeyContext ? `\nJourney context: ${journeyContext}` : ""}

Provide a concise response that:
1. Acknowledges the comment
2. Suggests how to apply this feedback
3. Ask clarifying questions if needed (max 2 questions)

Keep response under 200 words.`;
}
