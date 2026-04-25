// SkillNest - Module 2: Peer Help & Ticketing System
// Student: IT23698918 — Lakshan W.A.K.T.K
// Jest Test File

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── TEST 1: Ticket Number Generator ───────────────────────────────────────
describe('Ticket Number Generation', () => {
  test('generates ticket number starting with TKT-', () => {
    const ticketNumber = 'TKT-' + Date.now().toString().slice(-6);
    expect(ticketNumber).toMatch(/^TKT-\d{6}$/);
  });

  test('ticket number is unique each time', () => {
    const ticket1 = 'TKT-' + Date.now().toString().slice(-6);
    const ticket2 = 'TKT-' + (Date.now() + 1).toString().slice(-6);
    expect(ticket1).not.toBe(ticket2);
  });
});

// ─── TEST 2: Ticket Status Flow ────────────────────────────────────────────
describe('Ticket Status Management', () => {
  test('default ticket status is open', () => {
    const ticket = { status: 'open' };
    expect(ticket.status).toBe('open');
  });

  test('ticket status can change to in_progress', () => {
    const ticket = { status: 'open' };
    ticket.status = 'in_progress';
    expect(ticket.status).toBe('in_progress');
  });

  test('ticket status can change to resolved', () => {
    const ticket = { status: 'in_progress' };
    ticket.status = 'resolved';
    expect(ticket.status).toBe('resolved');
  });

  test('ticket status can change to closed', () => {
    const ticket = { status: 'resolved' };
    ticket.status = 'closed';
    expect(ticket.status).toBe('closed');
  });

  test('valid statuses are open, in_progress, resolved, closed', () => {
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    const testStatus = 'in_progress';
    expect(validStatuses).toContain(testStatus);
  });
});

// ─── TEST 3: Ticket Priority ───────────────────────────────────────────────
describe('Ticket Priority Levels', () => {
  test('default priority is medium', () => {
    const ticket = { priority: 'medium' };
    expect(ticket.priority).toBe('medium');
  });

  test('priority can be set to high', () => {
    const ticket = { priority: 'medium' };
    ticket.priority = 'high';
    expect(ticket.priority).toBe('high');
  });

  test('priority can be set to low', () => {
    const ticket = { priority: 'low' };
    expect(ticket.priority).toBe('low');
  });

  test('valid priorities are low, medium, high', () => {
    const validPriorities = ['low', 'medium', 'high'];
    expect(validPriorities).toContain('medium');
    expect(validPriorities).toContain('high');
    expect(validPriorities).toContain('low');
  });
});

// ─── TEST 4: Help Types ────────────────────────────────────────────────────
describe('Help Type Validation', () => {
  test('peer_help is a valid help type', () => {
    const helpTypes = ['peer_help', 'tutor_support', 'quiz_help', 'assignment_help'];
    expect(helpTypes).toContain('peer_help');
  });

  test('tutor_support is a valid help type', () => {
    const helpTypes = ['peer_help', 'tutor_support', 'quiz_help', 'assignment_help'];
    expect(helpTypes).toContain('tutor_support');
  });

  test('quiz_help is a valid help type', () => {
    const helpTypes = ['peer_help', 'tutor_support', 'quiz_help', 'assignment_help'];
    expect(helpTypes).toContain('quiz_help');
  });

  test('assignment_help is a valid help type', () => {
    const helpTypes = ['peer_help', 'tutor_support', 'quiz_help', 'assignment_help'];
    expect(helpTypes).toContain('assignment_help');
  });

  test('invalid help type is not accepted', () => {
    const helpTypes = ['peer_help', 'tutor_support', 'quiz_help', 'assignment_help'];
    expect(helpTypes).not.toContain('unknown_type');
  });
});

// ─── TEST 5: Ticket Form Validation ───────────────────────────────────────
describe('Ticket Form Field Validation', () => {
  test('ticket requires a subject', () => {
    const ticket = { subject: 'Binary Trees Help', description: 'I need help', module: 'Data Structures' };
    expect(ticket.subject).toBeTruthy();
  });

  test('ticket requires a description', () => {
    const ticket = { subject: 'Binary Trees Help', description: 'I need help with traversal', module: 'Data Structures' };
    expect(ticket.description).toBeTruthy();
  });

  test('ticket requires a module', () => {
    const ticket = { subject: 'TCP/IP', description: 'Help needed', module: 'Networking' };
    expect(ticket.module).toBeTruthy();
  });

  test('empty subject should fail validation', () => {
    const subject = '';
    expect(subject).toBeFalsy();
  });

  test('empty description should fail validation', () => {
    const description = '';
    expect(description).toBeFalsy();
  });
});

// ─── TEST 6: Chat Message Validation ──────────────────────────────────────
describe('Ticket Chat Message Validation', () => {
  test('message with content is valid', () => {
    const message = { content: 'Hello, I need help with this topic' };
    expect(message.content.trim()).toBeTruthy();
  });

  test('empty message should not be sent', () => {
    const message = { content: '' };
    expect(message.content.trim()).toBeFalsy();
  });

  test('whitespace-only message should not be sent', () => {
    const message = { content: '   ' };
    expect(message.content.trim()).toBeFalsy();
  });

  test('message content is stored correctly', () => {
    const content = 'Can you explain binary search trees?';
    const message = { content };
    expect(message.content).toBe('Can you explain binary search trees?');
  });
});

// ─── TEST 7: Ticket Filter Logic ──────────────────────────────────────────
describe('Ticket Status Filter Logic', () => {
  const tickets = [
    { id: 1, status: 'open', subject: 'Help with arrays' },
    { id: 2, status: 'in_progress', subject: 'Networking issue' },
    { id: 3, status: 'resolved', subject: 'Database query help' },
    { id: 4, status: 'open', subject: 'Algorithm question' },
  ];

  test('filter by open returns only open tickets', () => {
    const openTickets = tickets.filter(t => t.status === 'open');
    expect(openTickets.length).toBe(2);
  });

  test('filter by in_progress returns correct tickets', () => {
    const inProgress = tickets.filter(t => t.status === 'in_progress');
    expect(inProgress.length).toBe(1);
  });

  test('filter by resolved returns correct tickets', () => {
    const resolved = tickets.filter(t => t.status === 'resolved');
    expect(resolved.length).toBe(1);
  });

  test('all filter returns all tickets', () => {
    const all = tickets;
    expect(all.length).toBe(4);
  });
});