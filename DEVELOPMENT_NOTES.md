# Development Notes

## Important Guidelines for AI Assistant

### Debug Code Policy
**NEVER add debug code (console.log, console.error, etc.) unless explicitly requested by the user.**

- The user does not use debug code and does not know how to use it
- Debug code clutters the codebase unnecessarily
- If debug code is not needed for the program to function, it should not be added
- Only add debug code if the user specifically asks for it

### Code Quality Standards
- Keep code clean and production-ready
- Focus on functionality, not debugging
- Remove any debug code that was added during development
- Commit only working, clean code

### User Preferences
- This is a live production project
- User expects immediate working solutions
- No manual debugging steps should be required from the user
- All fixes should be handled programmatically

---
*This file serves as a reminder for AI assistants working on this project.*
