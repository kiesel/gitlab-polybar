import * as got from 'got';

export interface GitlabOptions {
  host?: string;
  privateToken?: string;
}

export interface ListMergeRequestArgs {
  author?: 'me' | string;
  state?: 'opened' | 'merged' | 'closed' | 'locked';
  scope?: 'created_by_me' | 'assigned_to_me' | 'all';
}

export interface FetchResult {
  mrByMe: MergeRequestDesc[];
  mrForMe: MergeRequestDesc[];
  mrAllMe: MergeRequestDesc[];
}

export interface User {
  avatar_url: string;
  id: number;
  name: string;
  state: string;
  username: string;
  web_url: string;
}

export interface MergeRequestDesc {
  assignee: User;
  assignees: User[];
  author: User;
  closed_at: string | null;
  closed_by: User | null;
  created_at: string;
  description: string;
  discussion_locked: boolean | null;
  downvotes: number;
  force_remove_source_branch: boolean;
  id: number;
  iid: number;
  labels: string[];
  merge_commit_sha1: string | null;
  merge_status: string;
  merge_when_pipeline_succeeds: boolean;
  merged_at: string | null;
  merged_by: User | null;
  milestone: string | null;
  project_id: number;
  reference: string;
  sha: string;
  should_remove_source_branch: boolean | null;
  source_branch: string;
  source_project_id: number;
  squash: boolean;
  state: string;
  target_branch: string;
  target_project_id: number;
  task_competion_status: {
    completed_count: number;
    count: number;
  };
  time_stats: {
    human_time_estimate: number | null;
    human_total_time_spent: number | null;
    time_estimate: number;
    total_time_spent: number;
  };
  title: string;
  updated_at: string | null;
  upvotes: number;
  user_notes_count: number;
  web_url: string;
  work_in_progress: boolean;
}

export class GitlabAPI {
  private host = 'https://gitlab.com/api/v3';
  private privateToken?: string;

  constructor(options: GitlabOptions) {
    Object.assign(this, options);
  }

  public async listMergeRequests(query: ListMergeRequestArgs): Promise<MergeRequestDesc[]> {
    const req: got.GotJSONOptions = {
      json: true,
      baseUrl: this.host,
      headers: {
        'Private-Token': this.privateToken,
      },
    };

    req.query = {
      author: query.author,
      state: query.state,
      scope: query.scope || 'all',
    };

    const res = await got.get('/merge_requests', req);
    const obj = res.body as MergeRequestDesc[];
    return obj;
  }

  public async fetch(argv: any): Promise<FetchResult> {
    const result: FetchResult = {
      mrByMe: [],
      mrForMe: [],
      mrAllMe: [],
    };

    if (argv.mrByMe) {
      result.mrByMe = await this.listMergeRequests({ state: 'opened', scope: 'created_by_me' });

      for (const idx in result.mrByMe) {
        const mr = result.mrByMe[idx];
        console.log(mr);

        if (mr.assignee.id === mr.author.id) {
          if (-1 === result.mrAllMe.findIndex(e => e.id === mr.id)) {
            result.mrAllMe.push(mr);
          }
        }
      }
    }

    if (argv.mrForMe) {
      result.mrForMe = await this.listMergeRequests({ state: 'opened', scope: 'assigned_to_me' });

      for (const idx in result.mrForMe) {
        const mr = result.mrForMe[idx];

        if (mr.assignee.id === mr.author.id) {
          if (-1 === result.mrAllMe.findIndex(e => e.id === mr.id)) {
            result.mrAllMe.push(mr);
          }
        }
      }
    }

    result.mrByMe = result.mrByMe.filter(elem => -1 === result.mrAllMe.findIndex(allElem => allElem.id === elem.id));
    result.mrForMe = result.mrForMe.filter(elem => -1 === result.mrAllMe.findIndex(allElem => allElem.id === elem.id));

    return result;
  }
}
