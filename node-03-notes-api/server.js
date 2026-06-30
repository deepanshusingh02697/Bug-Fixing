require("dotenv/config");
const express = require("express");
const app = express();
app.use(express.json());

let notes = [
  {
    id: 1,
    _userId: 1,
    title: "Meeting Notes",
    body: "Discuss Q3 roadmap and sprint planning.",
    tags: ["work", "planning"],
    pinned: false,
    createdAt: "2024-05-01T09:00:00Z",
    updatedAt: "2024-05-01T09:00:00Z",
  },
  {
    id: 2,
    _userId: 1,
    title: "Shopping List",
    body: "Milk, eggs, bread, coffee, and bananas.",
    tags: ["personal", "shopping"],
    pinned: true,
    createdAt: "2024-05-03T14:00:00Z",
    updatedAt: "2024-05-03T14:00:00Z",
  },
  {
    id: 3,
    _userId: 2,
    title: "React Study Notes",
    body: "Learn useCallback, useMemo, and React.memo for performance.",
    tags: ["study", "react"],
    pinned: false,
    createdAt: "2024-05-05T10:00:00Z",
    updatedAt: "2024-05-05T10:00:00Z",
  },
  {
    id: 4,
    _userId: 1,
    title: "Book Recommendations",
    body: "Clean Code, The Pragmatic Programmer, You Don't Know JS.",
    tags: ["books", "learning"],
    pinned: false,
    createdAt: "2024-05-08T11:00:00Z",
    updatedAt: "2024-05-08T11:00:00Z",
  },
  {
    id: 5,
    _userId: 2,
    title: "Workout Plan",
    body: "Mon: chest/triceps, Wed: back/biceps, Fri: legs/shoulders.",
    tags: ["health", "fitness"],
    pinned: true,
    createdAt: "2024-05-10T08:00:00Z",
    updatedAt: "2024-05-10T08:00:00Z",
  },
  {
    id: 6,
    _userId: 1,
    title: "Project Ideas",
    body: "Build a recipe app, a habit tracker, or a markdown editor.",
    tags: ["ideas", "projects"],
    pinned: false,
    createdAt: "2024-05-12T15:00:00Z",
    updatedAt: "2024-05-12T15:00:00Z",
  },
];

let nextId = 7;

async function getNotesForUser(userId) {
  console.log("get id : ", userId);

  return await new Promise((resolve) => {
    let result;
    setTimeout(() => {
      result = notes.filter((n) => n._userId === userId);
      resolve(result); //!
    }, 10);
  });
}

function getNoteById(id) {
  return Promise.resolve(notes.find((n) => n.id === id));
}

function mockAuth(req, res, next) {
  try {
    const userId = Number(req.headers["x-user-id"]);
    if (!userId)
      return res
        .status(401)
        .json({ error: "X-User-Id header required for this demo" });
    if (userId < 1 || userId > 2) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.userId = userId;
    next();
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

app.get("/notes", mockAuth, async (req, res) => {
  const { search, tag, pinned, page = 1, limit = 3 } = req.query;
  try {
    let userNotes = await getNotesForUser(req.userId);

    const s = search.toLowerCase();
    if (search) {
      userNotes = userNotes.filter(
        (n) =>
          n.title.toLowerCase().includes(s) || n.body.toLowerCase().includes(s),
      );
    }

    if (tag) {
      userNotes = userNotes.filter((n) => n.tags.includes(tag));
    }

    if (pinned === "true") {
      userNotes = userNotes.filter((n) => n.pinned);
    }
    
    const pageNum = Number(page);
    if(pageNum<1){
      return res.status(400).json({message:"Page number should be greater than 0 for pagination"})
    }
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;
    const paginated = userNotes.slice(offset, offset + limitNum);

    res.json({
      total: userNotes.length,
      page: pageNum,
      totalPages: Math.ceil(userNotes.length / limitNum),
      data: paginated,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});
app.post("/notes", mockAuth, async (req, res) => {
  try {
    const { title, body, tags, pinned } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!body || !body.trim()) {
      return res.status(400).json({ error: "Body is required" });
    }

    if (body.length > 1000) {
      return res
        .status(400)
        .json({ error: "Body cannot exceed 1000 characters" });
    }

    let normalizedTags = [];
    if(tags.trim() && typeof tag==='string'){
      normalizedTags.push(tag)
    }else{
      normalizedTags=tag
    }

    const newNote = {
      id: nextId++,
      _userId: req.userId,
      title: title.trim(),
      body: body.trim(),
      tags: normalizedTags,
      pinned: pinned === true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.push(newNote);
    const {_userId, ...safeNote} = newNote
    res.status(201).json(safeNote);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

app.get("/notes/:id", mockAuth, async (req, res) => {
  try {
    const note = await getNoteById(Number(req.params.id));
    if (!note) return res.status(404).json({ error: "Note not found" });
    if (note._userId !== req.userId) {
      return res
        .status(403)
        .json({ error: "authenticated but not authorised to access note" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

app.get("/notes/search", mockAuth, async (req, res) => {
  try {
    // const {search} = req.query
    // console.log(search);

    // if (search) {
    //   userNotes = userNotes.filter(
    //     (n) => n.title.includes(search) || n.body.includes(search),
    //   );
    // }
    res.json({ message: "Search endpoint" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

app.put("/notes/:id", mockAuth, async (req, res) => {
  try {
    const note = await getNoteById(Number(req.params.id));
    if (!note) return res.status(404).json({ error: "Note not found" });

    if (note._userId !== req.userId) {
      return res
        .status(403)
        .json({ error: "authenticated but not authorised to access note" });
    }

    const { title, body, tags, pinned } = req.body;

    if (body.length > 1000) {
      return res
        .status(400)
        .json({ error: "Body cannot exceed 1000 characters" });
    }

    if (title !== undefined) note.title = title.trim();
    if (body !== undefined) note.body = body.trim();
    if (tags !== undefined) note.tags = tags;
    if (pinned !== undefined) note.pinned = pinned;
    note.updatedAt = new Date().toISOString();

    res.json(note);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

app.delete("/notes/:id", mockAuth, async (req, res) => {
  try {
    const index = notes.findIndex((n) => n.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Note not found" });

    if (notes[index]._userId !== req.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const deletedNote = notes.splice(index, 1); //!
    res.status(200).json({ message: "Note deleted", deletedNote });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Notes API running on http://localhost:${PORT}`);
  console.log("\nAll requests require header: X-User-Id: 1 (or 2)");
  console.log("\nEndpoints:");
  console.log("  GET    /notes?page=1&limit=3&search=x&tag=work&pinned=true");
  console.log("  GET    /notes/:id");
  console.log("  POST   /notes");
  console.log("  PUT    /notes/:id");
  console.log("  DELETE /notes/:id");
});
