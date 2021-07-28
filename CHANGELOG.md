# Changelog

<!--new-version-->

## 0.0.17

- fix channel logs not logging to the right room

## 0.0.16

- bbcode preview goes away immediately after submitting

## 0.0.15

huge focus on improving BBCode stuff:

- improve bbcode shortcut behavior
  - when typing a shortcut without selected text, it'll put the cursor between the tags
  - if the BBC tag has a value, e.g. `[color=]`, the cursor will go after the `=`
- inserts `[url=][/url]` when pasting a link into a BBCode input
- fix bbcode links sometimes being broken
- render bbcode url as text when there is no text
  - e.g. `[url=https://example.com][/url]` will show as `https://example.com`
- improved bbcode link styling - fixes awkward wrapping and icon alignment
- the bbcode preview is now more accurate, and reflects _exactly_ what your message will look like, e.g. with /me
- bbcode preview doesn't cover stuff up anymore 👏
- new bbc colors! white and black have backgrounds to make them stand out a bit more

and some other general tweaks:

- temporary fix for possibly duplicate logs across characters
- temporary limit the number of displayed messages in log browser, performance reasons
- fix typing status sometimes being sent when it shouldn't
- improved message list bottom scrolling

## 0.0.14

- fix changelog link in app info

## 0.0.13

- show seconds on message timestamps

## 0.0.12

- restore last set status when logging in, with info on how it works
- errors in chat should be less... destructive?

## 0.0.11

- send your typing status in private chats
- removed notifications for status updates of your own characters
- (internal) add release script to make new releases easier

## 0.0.10

- made bbc bold text less bold
- moved message timestamps back to the left

## 0.0.9

- fix some potential funkyness when switching between channels and private chats, e.g. animations and scrollbars
- tweak to message notification text

## 0.0.8

- bug fix: always show system notes when tabbed out

## 0.0.7

- fixed a logic error for system notifications, where they wouldn't show in cases that they should have
- new unread notifications will be highlighted when viewing the notifications list
- fine-tuned which notifications count in the app title (for now, just invites and broadcasts)

## 0.0.6

- improved notification behavior when the window isn't visible

## 0.0.5

- fix format for generated private channel bbc links

## 0.0.4

- added desktop notifications for private chats! to activate them, hit the settings icon on the left
- fixed messages appearing twice in PMs
- fixed scrolling issues on private chat view

## 0.0.3

- show your current character name + unread count in the app title
- add changelog link to app info
- fix issue where some fullscreen island layouts couldn't scroll (e.g. login screen)
- moved the text wall on login to a click dialog

## 0.0.2

- rooms now highlight green on new messages

## 0.0.1

- fixed an issue where rooms would be preserved between characters

## 0.0.0

- open testing!!!
