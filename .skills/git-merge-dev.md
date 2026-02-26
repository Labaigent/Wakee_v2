---
description: Update README, commit changes, merge current branch to dev, optionally merge/push main, push dev, optionally delete feature branch, and give summary
argument-hint: [new-branch-name]
allowed-tools: Bash(git *)
---

# Git Merge to Dev Workflow (with optional main merge)

Automates the workflow: understand changes since last merge with dev, update README, commit, merge to dev, **propagar .gitignore (dev → main cuando se hace merge a main)**, optionally merge and push main, push dev, optionally delete the feature branch, and give a summary.

**Propagación de .gitignore:** Las reglas de `.gitignore` y el destracking de archivos deben aplicarse en `dev` y, cuando se hace merge con main, también en `main`. Así dev y main quedan consistentes.

## Workflow Steps

1. **Check Current Branch**
   - Run `git branch --show-current` to identify the current working branch
   - Store the branch name for later use (call it `<original-branch>`)
   - If it starts with `feature` or `feature/`, treat it as the feature branch to offer deleting later

2. **Review Current Changes**
   - Run `git status` to see all uncommitted changes
   - Run `git diff` to review changes in detail
   - Understand what has changed since the last merge with dev (e.g. `git log dev..HEAD --oneline`)

3. **Update README File**
   - Analyze all changes made in this branch
   - Update `README.md` to document any user-facing feature or installation requirements

4. **Commit README Changes**
   - Stage the README with `git add README.md`
   - Commit with `git commit -m "docs: update README with recent changes"`
   - Verify commit with `git log --oneline -1`

5. **Review Remaining Changes**
   - Run `git status` again to see any other uncommitted changes
   - Run `git diff` to review remaining changes in detail

6. **Commit Remaining Changes**
   - Analyze changes and determine appropriate commit type:
     - `feat:` `fix:` `docs:` `style:` `refactor:` `test:` `chore:`
   - Stage all changes with `git add -A`
   - Create a descriptive commit message following Conventional Commits
   - Commit with `git commit -m "type: descriptive message"`

7. **Switch to Dev Branch**
   - Run `git checkout dev`
   - Verify with `git branch --show-current`

8. **Merge Feature Branch into Dev**
   - Run `git merge <original-branch>`
   - If there are merge conflicts, pause and request manual resolution
   - Verify with `git log --oneline -5`

9. **Ensure .gitignore Changes Are Applied in dev (CRITICAL)**
   - **Detect if `.gitignore` changed in the merge:**
     - Run `git diff --name-only HEAD~1..HEAD | grep -x ".gitignore" || true`
   - If `.gitignore` changed (or if you suspect ignore rules were updated), do:
     1. **Check for tracked files that are now ignored:**
        - Run `git ls-files -ci --exclude-standard`
     2. If the above command outputs files, decide:
        - If they **should remain tracked**, do nothing.
        - If they **should stop being tracked**, untrack them (keeps files locally):
          - Run `git rm -r --cached -- $(git ls-files -ci --exclude-standard)`
          - Then commit: `git commit -m "chore: apply .gitignore rules in dev"`
     3. **Re-check:** Run `git ls-files -ci --exclude-standard` again (should be empty)
   - Confirm dev working tree is clean: `git status`

10. **Ask: ¿Quieres hacer merge con main?**
    - **Ask the user** (in the chat): "¿Quieres hacer merge de dev en main?"
    - **If the user says yes:**
      - Run `git checkout main`
      - Run `git merge dev`
      - If there are merge conflicts, pause and request manual resolution
      - **Propagar .gitignore a main (siempre después del merge):** Aplicar las mismas reglas que en dev para que main no siga trackeando archivos que ya están ignorados:
        1. Run `git ls-files -ci --exclude-standard` (archivos trackeados que ahora están en .gitignore)
        2. If the above outputs files and they should be untracked: `git rm -r --cached -- $(git ls-files -ci --exclude-standard)` then `git commit -m "chore: apply .gitignore rules in main"`
        3. Re-check: `git ls-files -ci --exclude-standard` (debe quedar vacío). Confirm `git status`
      - **Ask: ¿Quieres hacer push de main?**
        - **Ask the user**: "¿Quieres hacer push de main al remoto?"
        - **If the user says yes:** Run `git push origin main`
      - Run `git checkout dev` to return to dev
    - **If the user says no:** skip merge with main and stay on dev

11. **Push Dev Branch to Origin (automático)**
    - Run `git push origin dev`
    - Confirm the push was successful

12. **Ask: ¿Quieres eliminar la branch en la que estabas construyendo (feature/...)?**
    - Only offer this if `<original-branch>` looks like a feature branch (e.g. starts with `feature` or `feature/`).
    - **Ask the user**: "¿Quieres eliminar la branch `<original-branch>`? (Ya está mergeada en dev)"
    - **If the user says yes:**
      - Ensure you are on `dev` (not on the feature branch): `git checkout dev` if needed
      - Run `git branch -d <original-branch>`
      - If Git reports it is not fully merged and the user confirmed delete, use `git branch -D <original-branch>`
      - Confirm with `git branch -a`
    - **If the user says no:** do not delete the branch. User can switch to it later with `git checkout <original-branch>`.

13. **Create New Feature Branch (opcional)**
    - If the user provided a new branch name in `$ARGUMENTS` and wants to keep working:
      - Run `git checkout -b $ARGUMENTS`
      - Confirm with `git branch --show-current`
    - If no argument or user did not ask for a new branch: leave the user on `dev`.

14. **Summary Report**
    - Provide a clear summary of what was done:
      - Cambios entendidos desde el último merge con dev
      - README actualizado (sí/no y qué se documentó)
      - Commits creados (mensajes)
      - Merge a dev (éxito/conflictos)
      - Propagación .gitignore: aplicado en dev; en main (sí/no, si se hizo merge)
      - ¿Se hizo merge con main? (sí/no)
      - ¿Se hizo push de main? (sí/no)
      - Push de dev (éxito)
      - ¿Se eliminó la branch feature? (sí/no, nombre de la branch)
      - Branch nueva creada (si aplica)

## Important Notes

- **Propagación de .gitignore:** Siempre aplicar en `dev` (paso 9) y, al hacer merge con main, **siempre** en `main` (paso 10). Así las reglas de ignore y el destracking se mantienen en ambas ramas.
- **Key `.gitignore` truth:** `.gitignore` does **not** stop tracking files that are already tracked. Use `git rm --cached` to untrack them (files stay on disk).
- **Merge conflicts:** If conflicts occur during any merge, pause and ask the user to resolve them manually.
- **Branch protection:** Ensure you have permission to push to `dev` and `main` when the user asks for it.
- **Conventional Commits:** This workflow follows the Conventional Commits specification.
- **Argument optional:** `[new-branch-name]` is optional; use it only if the user wants to create a new feature branch after the workflow.
