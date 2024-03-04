import { InfomaniakClient } from '../infomaniak-client.class.ts';
import { Abortable } from '../types/abortable.type.ts';
import { ProductId } from '../types/product-id.type.ts';
import { Conversation, ConversationOptions } from './conversation.class.ts';

/* TYPES */


/* QUERY */

// API documentation: https://developer.infomaniak.com/docs/api/post/1/llm/%7Bproduct_id%7D

export type InfomaniakLLMQueryModel = 'mixtral';
export type InfomaniakLLMQueryProfileType = 'creative' | 'standard' | 'strict';
export type InfomaniakLLMQueryMessageRole = 'user' | 'assistant';

export interface InfomaniakLLMQueryOptions extends Abortable {
  readonly product_id: ProductId;
  readonly max_new_tokens?: number;
  readonly messages: readonly InfomaniakLLMQueryMessage[];
  readonly model?: InfomaniakLLMQueryModel;
  readonly profile_type?: InfomaniakLLMQueryProfileType;
  readonly repetition_penalty?: number;
  readonly seed?: number;
  readonly system_prompt?: string;
  readonly temperature?: number;
  readonly top_k?: number;
  readonly top_p?: number;
  readonly truncate?: number;
  readonly typical_p?: number;
}

export interface InfomaniakLLMQueryMessage {
  readonly content: string;
  readonly role: InfomaniakLLMQueryMessageRole;
}

export interface InfomaniakLLMQueryResponse {
  readonly model: InfomaniakLLMQueryModel;
  readonly created: number;
  readonly choices: readonly InfomaniakLLMQueryChoice[];
  readonly usage: InfomaniakLLMQueryUsage;
}

export interface InfomaniakLLMQueryChoice {
  readonly index: number;
  readonly message: InfomaniakLLMQueryMessage;
  readonly finish_reason: string;
}

export interface InfomaniakLLMQueryUsage {
  readonly input_tokens: number;
  readonly output_tokens: number;
  readonly total_tokens: number;
}

export type InfomaniakLLMStartConversationOptions = Omit<ConversationOptions, 'client'>;

/* CLASS */

/**
 * This service is used to communicate with the LLM API of Infomaniak.
 */
export class InfomaniakLLM {
  readonly #client: InfomaniakClient;

  constructor(
    client: InfomaniakClient,
  ) {
    this.#client = client;
  }

  /**
   * Performs a query on a LLM model.
   *
   * doc: https://developer.infomaniak.com/docs/api/post/1/llm/%7Bproduct_id%7D
   */
  query(
    {
      product_id,
      max_new_tokens,
      messages,
      model,
      profile_type,
      repetition_penalty,
      seed,
      system_prompt,
      temperature,
      top_k,
      top_p,
      truncate,
      typical_p,
      signal,
    }: InfomaniakLLMQueryOptions,
  ): Promise<InfomaniakLLMQueryResponse> {
    return this.#client.json(`/1/llm/${product_id}`, {
      signal,
      method: 'POST',
      body: JSON.stringify({
        max_new_tokens,
        messages,
        model,
        profile_type,
        repetition_penalty,
        seed,
        system_prompt,
        temperature,
        top_k,
        top_p,
        truncate,
        typical_p,
      }),
    });
  }

  /**
   * Starts a conversation with the model.
   */
  startConversation(
    options: InfomaniakLLMStartConversationOptions,
  ): Conversation {
    return new Conversation({
      ...options,
      client: this,
    });
  }
}


