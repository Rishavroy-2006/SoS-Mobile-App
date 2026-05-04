import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, UserPlus, Trash2, Edit2, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  active: boolean;
  initials: string;
}

const ContactsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Sarah Jenkins', phone: '+1 (555) 019-2834', active: true, initials: 'SJ' },
    { id: '2', name: 'Michael Ross', phone: '+1 (555) 837-9912', active: false, initials: 'MR' },
    { id: '3', name: 'Emma Davis', phone: '+1 (555) 231-4456', active: true, initials: 'ED' },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const toggleContact = (id: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const startEdit = (e: React.MouseEvent, contact: Contact) => {
    e.stopPropagation();
    setEditingId(contact.id);
    setEditName(contact.name);
    setEditPhone(contact.phone);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditName('');
    setEditPhone('');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';
  };

  const saveEdit = (e: React.MouseEvent | React.FormEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim()) return;
    
    setContacts(prev => prev.map(c => c.id === id ? { 
      ...c, 
      name: editName, 
      phone: editPhone,
      initials: getInitials(editName)
    } : c));
    setEditingId(null);
  };

  const saveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim()) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: editName,
      phone: editPhone,
      active: true,
      initials: getInitials(editName)
    };

    setContacts(prev => [...prev, newContact]);
    setIsAdding(false);
  };

  const cancelEditAdd = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const deleteContact = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setContacts(prev => prev.filter(c => c.id !== id));
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#151515] text-[#e4e2e4]">
      <header className="flex items-center gap-4 px-4 pt-12 pb-6 border-b border-[#2a2a2c]">
        <button onClick={onBack} className="p-2 -ml-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-lg flex-1 mr-8 text-center text-[#e4e2e4]">Calculator</span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-12 pt-6">
        <h1 className="text-3xl font-bold mb-1">Trusted Contacts</h1>
        <p className="text-[#dac3ad]/80 text-[15px] mb-8">Manage your safety network</p>

        <p className="text-[#dac3ad]/60 text-[13px] mb-8 ml-2">
          Your contacts will be notified silently when emergency mode is triggered.
        </p>

        <div className="flex flex-col gap-4">
          {contacts.map(contact => {
            const isEditing = editingId === contact.id;

            return isEditing ? (
              <form 
                key={contact.id}
                onSubmit={(e) => saveEdit(e, contact.id)}
                className="bg-[#1f1f21] border border-[#2a2a2c] p-4 rounded-2xl flex flex-col gap-3 shadow-sm"
              >
                <input 
                  type="text" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Contact Name"
                  className="bg-[#151515] border border-[#2a2a2c] text-[#e4e2e4] text-[15px] px-3 py-2 rounded-xl focus:outline-none focus:border-primary placeholder:text-[#dac3ad]/40"
                  autoFocus
                />
                <input 
                  type="tel" 
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="bg-[#151515] border border-[#2a2a2c] text-[#e4e2e4] text-[15px] font-mono px-3 py-2 rounded-xl focus:outline-none focus:border-primary placeholder:text-[#dac3ad]/40"
                />
                <div className="flex items-center justify-between mt-1">
                  <button 
                    type="button"
                    onClick={(e) => deleteContact(e, contact.id)}
                    className="p-2 text-error hover:bg-error/10 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={cancelEditAdd}
                      className="px-4 py-2 text-[#dac3ad] bg-[#2a2a2c] rounded-xl text-sm font-medium hover:bg-[#333] transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 text-[#151515] bg-primary rounded-xl text-sm font-medium hover:bg-white transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div 
                key={contact.id}
                className="bg-[#1f1f21] border border-[#2a2a2c] p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer hover:bg-primary/5 transition-colors group"
                onClick={() => toggleContact(contact.id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-[46px] h-[46px] flex-shrink-0 rounded-full flex items-center justify-center font-bold text-[15px] ${contact.active ? 'bg-[#ffc688]/10 text-primary' : 'bg-[#2a2a2c] text-[#dac3ad]/50'}`}>
                    {contact.initials}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 mr-4">
                    <div className="font-medium text-[15px] text-[#e4e2e4] truncate">{contact.name}</div>
                    <div className="text-[12px] mt-[2px] text-[#dac3ad]/60 font-mono tracking-tight flex items-center gap-2">
                       {contact.phone}
                       <button 
                          onClick={(e) => startEdit(e, contact)}
                          className="p-1 text-[#dac3ad]/40 hover:text-primary transition-colors focus:outline-none"
                        >
                          <Edit2 size={12} />
                        </button>
                    </div>
                  </div>
                </div>
                
                <button className={`w-12 h-[26px] flex-shrink-0 rounded-full p-[2px] transition-colors ${contact.active ? 'bg-primary' : 'bg-[#151515] border border-[#2a2a2c]'}`}>
                  <motion.div 
                    layout
                    className={`w-5 h-5 rounded-full ${contact.active ? 'bg-white ml-auto shadow-sm' : 'bg-[#2a2a2c]'}`}
                  />
                </button>
              </div>
            );
          })}
          
          {isAdding && (
            <form 
              onSubmit={saveAdd}
              className="bg-[#1f1f21] border border-primary/30 p-4 rounded-2xl flex flex-col gap-3 shadow-sm mt-2"
            >
              <input 
                type="text" 
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Contact Name"
                className="bg-[#151515] border border-[#2a2a2c] text-[#e4e2e4] text-[15px] px-3 py-2 rounded-xl focus:outline-none focus:border-primary placeholder:text-[#dac3ad]/40"
                autoFocus
              />
              <input 
                type="tel" 
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                placeholder="Phone Number"
                className="bg-[#151515] border border-[#2a2a2c] text-[#e4e2e4] text-[15px] font-mono px-3 py-2 rounded-xl focus:outline-none focus:border-primary placeholder:text-[#dac3ad]/40"
              />
              <div className="flex items-center justify-end gap-2 mt-1">
                <button 
                  type="button"
                  onClick={cancelEditAdd}
                  className="px-4 py-2 text-[#dac3ad] bg-[#2a2a2c] rounded-xl text-sm font-medium hover:bg-[#333] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-[#151515] bg-primary rounded-xl text-sm font-medium hover:bg-white transition-colors flex items-center gap-1"
                >
                  <Check size={16} /> Add
                </button>
              </div>
            </form>
          )}
        </div>

        {!isAdding && (
          <button 
            onClick={startAdd}
            className="w-full mt-6 py-[18px] bg-[#1f1f21] border border-dashed border-[#2a2a2c] rounded-2xl flex items-center justify-center gap-3 text-primary font-medium hover:bg-primary/10 transition-colors active:scale-[0.98]"
          >
            <UserPlus size={20} />
            Add New Contact
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactsScreen;
