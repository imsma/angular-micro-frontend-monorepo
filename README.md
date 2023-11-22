# Angular Micro Frontend using Monorepo approach

## Step zero

Make sure Angular CLI is installed, if not intsall it using following command.

```
npm install -g @angular/cli
```

Verify instalation using following command.

```
ng version
```

## Setup

1. Create workspace

```
ng new ng-mono-repo-workspace --create-application=false
```

2. Create Host app

```
ng g application host-app --routing --style=scss
```

3. Create Remote app

```
ng g application remote-app --routing --style=scss
```

4. Serve the host app

```
ng serve host-app  -o
```

5. Add module federation for host project

```
ng add @angular-architects/module-federation --project host-app --port 4200 --type host
```

5. Add module federation for remote project.

```
ng add @angular-architects/module-federation --project remote-app --port 4300 --type remote
```

6. Create home component for host-project.

```
ng g c home --project host-app
```

7. Add routing `ng-mono-repo-workspace/projects/remote-app/src/app/app.routes.ts`

```
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'todo-list',
    loadChildren: () =>
      import('remote-app/TodoListModule').then((m) => m.TodoListModule),
  },
```

8. Create virtual route file.

```
ng-mono-repo-workspace/projects/host-app/src/declare.d.ts
```

with following contents

```
declare module 'remote-app/TodoListModule';
```

9. Make changes in `ng-mono-repo-workspace/projects/host-app/webpack.config.js`

```
remotes: {
    "remote-app": "http://localhost:4300/remoteEntry.js",
  },
```

10. Create todo module

```
ng g m todo-list --project remote-app
```

11. Create todo-list componenet

```
ng g c todo-list --project remote-app
```

12. Add routing in `ng-mono-repo-workspace/projects/remote-app/src/app/todo-list/todo-list.module.ts`

```
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: TodoListComponent, pathMatch: 'full' },
    ]),
  ],
})
```

13. Add some text in `ng-mono-repo-workspace/projects/remote-app/src/app/todo-list/todo-list.component.html`

```
<h1>This is from Remote App</h1>

<pre>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis atque soluta voluptate beatae ullam ratione nemo explicabo neque unde iusto?
</pre>
```

14. Add routes in `ng-mono-repo-workspace/projects/remote-app/src/app/app.routes.ts`

```
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todo-remote',
    pathMatch: 'full',
  },
  {
    path: 'todo-remote',
    component: TodoListComponent,
  },
];

```

15. if there is compilation error add following entry in `ng-mono-repo-workspace/projects/remote-app/tsconfig.app.json`

```
...
  "files": [
        ...,
     "src/app/todo-list/todo-list.module.ts"
    ],

...
```

16. Now remote app module and components are accesible via host app.

(http://localhost:4200/todo-list)[http://localhost:4200/todo-list]

## Mono-Repo vs Multi-Repo

The difference between a mono-repo and multi-repo approach in software development lies in how codebases are structured and managed:

1. **Mono-Repo (Monolithic Repository):**

   - **Single Repository:** All projects, services, and code live in a single repository.
   - **Unified Versioning:** There’s one source of truth for all code, which simplifies dependency management and versioning.
   - **Easier Refactoring:** Changes across modules or projects can be made in a single commit, making refactoring and updating dependencies easier.
   - **Centralized Tooling and Configuration:** Build tools, testing frameworks, and other configurations are unified, ensuring consistency across the entire codebase.
   - **Collaboration and Visibility:** Teams have visibility into the entire codebase, promoting collaboration and reducing duplication.
   - **Challenges:** Can become large and unwieldy, requiring robust tooling for code management. It can also lead to longer build times and more complex CI/CD pipelines.

2. **Multi-Repo (Multiple Repositories):**
   - **Separate Repositories:** Each project or service has its own repository.
   - **Decentralized Management:** Teams can work independently on their respective repositories, with separate versioning and release cycles.
   - **Focused and Lightweight:** Each repo is typically smaller and more focused on a specific service or component, leading to quicker build times.
   - **Flexibility in Tools and Processes:** Different projects can use different tools and processes that are best suited for their needs.
   - **Isolation of Changes:** Changes in one repo do not directly affect others, reducing the risk of widespread issues.
   - **Challenges:** Managing dependencies across repositories can be complex. It also requires more effort to ensure consistency in coding standards and tooling across projects.

In essence, the choice between a mono-repo and multi-repo setup depends on the specific needs of a project or organization, including factors like team size, project complexity, and preferred workflows.
