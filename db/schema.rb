# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150309062037) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "completables", force: :cascade do |t|
    t.integer  "household_id"
    t.integer  "completor_id"
    t.datetime "completed_at"
    t.integer  "acceptor_id"
    t.datetime "accepted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "notes",                    default: ""
    t.integer  "creator_id"
    t.string   "title",        limit: 255, default: ""
    t.string   "type",         limit: 255
    t.string   "aasm_state",   limit: 255
    t.integer  "position"
  end

  create_table "events", force: :cascade do |t|
    t.string   "ip_address",  limit: 255
    t.string   "description", limit: 255
    t.string   "type",        limit: 255
    t.integer  "target_id"
    t.string   "target_type", limit: 255
    t.integer  "actor_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "households", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "memberships", force: :cascade do |t|
    t.integer  "member_id"
    t.integer  "household_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_admin",      default: false
    t.boolean  "is_head_admin", default: false
  end

  add_index "memberships", ["member_id", "household_id"], name: "index_memberships_on_member_id_and_household_id", unique: true, using: :btree

  create_table "tag_titles", force: :cascade do |t|
    t.string   "title",      limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tags", force: :cascade do |t|
    t.string   "taggable_type", limit: 255
    t.integer  "taggable_id"
    t.integer  "tag_title_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                      default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "first_name",             limit: 255, default: ""
    t.string   "last_name",              limit: 255, default: ""
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
