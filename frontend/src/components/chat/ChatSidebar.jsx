import { getInitials, useSelectedConversation } from "../../hooks/useSelectedConversation";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { APP_NAME, AppLogo } from "../AppLogo";
import { UserButton } from "@clerk/react";
import { SearchField, Tabs } from "@heroui/react";
import { MessageSquare, Users, Sparkles } from "lucide-react";
import { ConversationRow } from "./ConversationRow";

function mapUserForList(user, onlineUsers) {
  const isOnline = onlineUsers.includes(user._id);
  return {
    conversationId: user._id,
    id: user._id,
    name: user.fullName,
    avatarUrl: user.profilePic,
    initials: getInitials(user.fullName),
    isOnline,
    peer: {
      name: user.fullName,
      avatarUrl: user.profilePic,
      initials: getInitials(user.fullName),
      isOnline,
    },
  };
}

function ChatSidebar() {
  const conversations = useChatStore((state) => state.conversations);
  const users = useChatStore((state) => state.users);
  const searchQuery = useChatStore((state) => state.searchQuery);
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);
  const sidebarTab = useChatStore((state) => state.sidebarTab);
  const setSidebarTab = useChatStore((state) => state.setSidebarTab);
  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const { activeConversationId, isLargeScreen } = useSelectedConversation();

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const conversationUsers = conversations.map((user) => mapUserForList(user, onlineUsers));
  const allUsers = users.map((user) => mapUserForList(user, onlineUsers));
  const filteredConversations = normalizedSearchQuery
    ? conversationUsers.filter((conversation) => conversation.peer.name.toLowerCase().includes(normalizedSearchQuery))
    : conversationUsers;
  const filteredUsers = normalizedSearchQuery
    ? allUsers.filter((user) => user.name.toLowerCase().includes(normalizedSearchQuery))
    : allUsers;
  const onlineCount = allUsers.filter((user) => user.isOnline).length;

  return (
    <aside
      className={`nook-sidebar flex w-full shrink-0 flex-col overflow-hidden border-r lg:w-[310px] xl:w-[330px] ${
        !isLargeScreen && activeConversationId ? "hidden lg:flex" : "flex"
      }`}
    >
      <div className="nook-sidebar-brand shrink-0 px-4 pb-4 pt-5 sm:px-5 sm:pt-6">
        <div className="flex items-center gap-3">
          <AppLogo size={42} className="rounded-[14px] shadow-md" alt="" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[19px] font-bold leading-tight tracking-[-0.045em]">{APP_NAME}</p>
            <p className="nook-sidebar-subtitle mt-1 text-[10px] font-semibold uppercase tracking-[0.13em]">Your own little corner</p>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-9 ring-2 ring-white/75 dark:ring-white/10",
              },
            }}
          />
        </div>

        <div className="nook-inbox-heading mt-6 flex items-end justify-between gap-2">
          <div>
            <p className="nook-section-label mb-1 text-[10px] font-bold uppercase tracking-[0.16em]">Your space</p>
            <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.05em]">Inbox</h2>
          </div>
          <div className="nook-presence-chip inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold">
            <span className="nook-presence-dot" /> {onlineCount} online
          </div>
        </div>
      </div>

      <Tabs
        selectedKey={sidebarTab}
        onSelectionChange={(key) => setSidebarTab(String(key))}
        variant="secondary"
        className="nook-sidebar-tabs flex flex-1 flex-col overflow-y-auto"
      >
        <div className="nook-sidebar-search shrink-0 px-4 pb-3 pt-1 sm:px-5">
          <SearchField fullWidth variant="secondary" className="nook-search w-full" value={searchQuery} onChange={setSearchQuery}>
            <SearchField.Group className="nook-search-group rounded-[13px]">
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Find someone..." />
              {searchQuery ? <SearchField.ClearButton /> : null}
            </SearchField.Group>
          </SearchField>
        </div>

        <Tabs.ListContainer className="nook-tabs-container shrink-0 px-4 pb-3 sm:px-5">
          <Tabs.List className="nook-tabs-list w-full gap-1">
            <Tabs.Tab id="chats" className="nook-tab flex-1 justify-center gap-1.5">
              <MessageSquare className="size-3.5" aria-hidden />
              Chats
              <span className="nook-tab-count">{conversations.length}</span>
            </Tabs.Tab>
            <Tabs.Tab id="users" className="nook-tab flex-1 justify-center gap-1.5">
              <Users className="size-3.5" aria-hidden />
              People
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="chats" className="nook-people-panel flex-1 overflow-x-hidden overflow-y-auto outline-none">
          {filteredConversations.length === 0 ? (
            <div className="nook-sidebar-empty mx-4 my-3 rounded-2xl px-4 py-5 text-center">
              <Sparkles className="mx-auto mb-2 size-5" aria-hidden />
              <p className="text-[12px] font-semibold">No chats just yet</p>
              <p className="nook-muted mt-1 text-[11px] leading-5">Search for someone in People to start a conversation.</p>
            </div>
          ) : filteredConversations.map((conversation) => (
            <ConversationRow
              key={conversation.id}
              user={conversation}
              selected={conversation.id === activeConversationId}
              onSelect={() => setActiveConversationId(conversation.id)}
            />
          ))}
        </Tabs.Panel>

        <Tabs.Panel id="users" className="nook-people-panel flex-1 overflow-x-hidden overflow-y-auto outline-none">
          {filteredUsers.length === 0 ? (
            <p className="nook-muted px-4 py-6 text-center text-[12px]">No people match your search.</p>
          ) : filteredUsers.map((user) => (
            <ConversationRow
              key={user.conversationId}
              user={user}
              selected={user.conversationId === activeConversationId}
              onSelect={() => setActiveConversationId(user.conversationId)}
            />
          ))}
        </Tabs.Panel>
      </Tabs>

      <div className="nook-sidebar-footer mx-4 mb-4 mt-2 flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 sm:mx-5">
        <span className="nook-footer-mark"><Sparkles className="size-3.5" aria-hidden /></span>
        <span className="text-[10px] font-medium">A little hello goes a long way.</span>
      </div>
    </aside>
  );
}
export default ChatSidebar;
