import React from 'react';

export default function CreateJamForm({ newPageName, setNewPageName, createNewPage }) {
  return (
    <form className="create-jam-form" onSubmit={createNewPage}>
      <input
        className="jam-input"
        type="text"
        value={newPageName}
        onChange={e => setNewPageName(e.target.value)}
        placeholder="Enter jam name"
        required
      />
      <button className="btn jam-btn" type="submit">Create a Jam</button>
    </form>
  );
}
