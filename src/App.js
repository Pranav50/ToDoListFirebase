import React, { Component } from 'react';
import './App.css';
import Note from './Note/Note';
import NoteForm from './NoteForm/NoteForm';
import { DB_CONFIG } from './Config/config';
import firebase from 'firebase/app';
import 'firebase/database'

class App extends Component {
  constructor(props) {
      super(props);

      this.addNote = this.addNote.bind(this);
      this.removeNote = this.removeNote.bind(this);

      this.app = firebase.initializeApp(DB_CONFIG);
      this.db = this.app.database().ref().child('notes');

      this.state = {
        notes:[],
      }
  }

  componentWillMount() {
    const previousNotes = this.state.notes;

    // Data Snapshot
    
    this.db.on('child_added', snap => {
      previousNotes.push({
        id: snap.key,
        noteContent: snap.val().noteContent
      })

      this.setState({
        notes: previousNotes
      })
    });

    this.db.on('child_removed', snap => {
      for(var i = 0; i < previousNotes.length; i++) {
          if(previousNotes[i].id === snap.key) {
            previousNotes.splice(i, 1);
          }
      }

      this.setState({
        notes: previousNotes
      })
    })
  }
  

  addNote(note) {

    this.db.push().set({ noteContent: note});
    // const previousNotes = this.state.notes
    // previousNotes.push({ id: previousNotes.length + 1, noteContent: note});
    // this.setState({
    //   notes: previousNotes
    // });
  }

  removeNote(noteId) {
    this.db.child(noteId).remove();
  }

  render() {
    return (
      <div>
        <div className="notesWrapper">
          <div className="notesHeader">
            <div className="heading">React and Firebase To-Do List</div>
          </div>
          <div className="notesBody">
            {
                this.state.notes.map((note) => {
                  return (
                    <Note noteContent={note.noteContent} 
                          noteId={note.id} 
                          key={note.id} 
                          removeNote={this.removeNote}/>
                  )
                })    
            }
              
          </div>
          <div className="notesFooter">
            <NoteForm  addNote={this.addNote}/>
          </div>
        </div>
      </div>
    );

  }
}

export default App;
