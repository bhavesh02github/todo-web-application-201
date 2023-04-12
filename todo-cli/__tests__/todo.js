let todoList = require('../todo');

const {all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("TodoList Test Suite", () => {
    beforeAll(() => {

        const today = new Date();
        const oneday = 60 * 60 * 24 * 1000;
        [
            {
                title: "Buy curd",
                completed: false,
                dueDate: new Date(today.getTime() - 2 * oneday).toISOString().slice(0,10),

            },
            {
                title: "Pay exam fee",
                completed: false,
                dueDate: new Date().toISOString().slice(0,10),
            },
            {
                title: "Submit Assignment",
                completed: false,
                dueDate: new Date(today.getTime() + 2 * oneday).toISOString().slice(0,10),,
            },
        ].forEach(add);
    });
    test("Should add new todo", () => {
        expect(all.length).toEqual(3);
        add(
            {
                title: "Test todo item",
                completed: false,
                dueDate: new Date().toISOString().slice(0,10),
            }
        );

        expect(all.length).toEqual(4);
    });

    test("Should mark a todo as complete", () => {
        expect(all[0].completed).toEqual(false);
        markAsComplete(0);
        expect(all[0].completed).toEqual(true);
    });

    test("Should retrieve overdue items", () => {
        expect(overdue().length).toEqual(1);
    });

    test("Should retrieve due today items", () => {
        expect(dueToday().length).toEqual(2);
    });

    test("Should retrieve due later items", () => {
        expect(dueLater().length).toEqual(1);
    });
});
