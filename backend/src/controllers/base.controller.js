class BaseController {
    constructor(model, name) {
        this.model = model;
        this.name = name;
    }

    success(res, data, statusCode = 200) {
        res.status(statusCode).json(data);
    }

    error(res, error) {
        const status = error.status || 500;
        const message = error.message || "Internal Server Error";
        res.status(status).json({ message });
    }

    getAll = async (req, res) => {
        try {
            const items = await this.model.find();
            this.success(res, items);
        } catch (err) {
            this.error(res, err);
        }
    };

    getById = async (req, res) => {
        try {
            const item = await this.model.findById(req.params.id);
            if (!item) {
                const err = new Error(`${this.name} not found`);
                err.status = 404;
                throw err;
            }
            this.success(res, item);
        } catch (err) {
            this.error(res, err);
        }
    };

    create = async (req, res) => {
        try {
            const item = await this.model.create(req.body);
            this.success(res, item, 201);
        } catch (err) {
            this.error(res, err);
        }
    };

    update = async (req, res) => {
        try {
            const item = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!item) {
                const err = new Error(`${this.name} not found`);
                err.status = 404;
                throw err;
            }
            this.success(res, item);
        } catch (err) {
            this.error(res, err);
        }
    };

    delete = async (req, res) => {
        try {
            const item = await this.model.findByIdAndDelete(req.params.id);
            if (!item) {
                const err = new Error(`${this.name} not found`);
                err.status = 404;
                throw err;
            }
            this.success(res, { message: `${this.name} deleted successfully` });
        } catch (err) {
            this.error(res, err);
        }
    };
}

export default BaseController;
