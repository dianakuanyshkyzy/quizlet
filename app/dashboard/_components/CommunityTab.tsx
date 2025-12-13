"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { CommunityModule as CommunityModuleType } from "@/lib/api";
import { useState } from "react";

type Props = {
  communityModules: CommunityModuleType[];
  onSearch: (q: string) => void;
  onViewModule: (id: string) => void;
};

export default function CommunityTab({
  communityModules,
  onSearch,
  onViewModule,
}: Props) {
  const [inputValue, setInputValue] = useState("");
  return (
    <main>
      <div>
        <h2 className="text-2xl text-[#4255FF] font-bold mb-4 text-center">
          Community Modules
        </h2>
        <p className="text-center">
          Search and explore modules shared by the Imba Learn community!
        </p>
      </div>

      <div>
        <div
          className="flex w-full max-w-2xl mx-auto items-center gap-2 mb-10"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSearch(inputValue);
            }
          }}
        >
          <Input
            type="text"
            placeholder="Search community modules..."
            className="h-10"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            type="submit"
            variant="default"
            onClick={() => onSearch(inputValue)}
          >
            Search
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {communityModules.map((m: CommunityModuleType) => (
            <Card key={m.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <span className="text-lg font-semibold">{m.title}</span>

                    <p className="text-muted-foreground text-sm">
                      {m.description}
                    </p>
                  </div>

                  <div>
                    <span className="bg-muted text-muted-foreground rounded-2xl px-3 py-1 text-sm">
                      {m.termsCount} terms
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-7">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <p className="pb-2 text-sm text-gray-500">Shared by:</p>
                    <div className="flex gap-x-2 items-center">
                      <Avatar className="size-10 border border-gray-100">
                        <AvatarImage
                          src={
                            "https://imba-server.up.railway.app" + m.ownerImg
                          }
                          alt={m.ownerName}
                          crossOrigin="anonymous"
                        />
                        <AvatarFallback>
                          {m.ownerName.charAt(0) + m.ownerName.charAt(1)}
                        </AvatarFallback>
                      </Avatar>
                      <p>{m.ownerName}</p>
                    </div>
                  </div>

                  <div>
                    <Button
                      size="sm"
                      className="mt-4"
                      onClick={() => onViewModule(m.id)}
                    >
                      View Module
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
