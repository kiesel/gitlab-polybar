# gitlab-polybar

A simple script to fetch status of merge requests from a GitLab instance.

Run this:

```
$ gitlab-polybar fetch --mr-for-me --mr-by-me --apikey <apikey> --url <url>
2/1  | 3/3  | 6/5 
```

Add it to your polybar config:

```
[module/gitlab]
type = custom/script
exec = gitlab-polybar fetch --mr-for-me --mr-by-me --apikey <apikey> --url <url>
interval = 900
```
